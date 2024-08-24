import { db } from '$lib/db/db.server.js';
import { sessions, users } from '$lib/db/schema.js';
import { computeHash } from '$lib/server/utils.js';
import { fail, redirect } from '@sveltejs/kit';
import { and, eq, lt, sql } from 'drizzle-orm';

// Actions object to handle server-side form submissions for user authentication.
export const actions = {
    /**
     * Action to log a user in.
     * Validates user credentials, sets a session cookie, and redirects to the homepage if successful.
     * @param event - The request event containing form data.
     * @returns A redirect to the homepage or a failure response if authentication fails.
     */
    login: async (event) => {
        const formData = await event.request.formData(); // Parse form data from the request.
        const username = formData.get('username') as string | null; // Extract the username.
        const password = formData.get('password') as string | null; // Extract the password.
        const error = 'Username or password are incorrect!';

        // Validate that both username and password are provided.
        if (!username || !password) {
            return fail(400, {missing: true, error});
        }

        // Make username case-insensitive
        const arr = username.toLowerCase().split('.');
        // Username format is always firstName.lastName
        if (arr.length !== 2) {
            return fail(400, {incorrect: true, error});
        }

        const [firstName, lastName] = arr;
        const userArr = await db.select().from(users)
                            .where(and(
                                eq(sql`lower(${users.firstName})`, firstName),
                                eq(sql`lower(${users.lastName})`, lastName)));
        if (userArr.length === 0) {
            return fail(400, {incorrect: true, error});
        }

        const user = userArr[0];
        // We store SHA-256 hashes of passwords in the DB, not the passwords themselves
        const passHash = computeHash(password);
        if (user.password !== passHash) {
            return fail(400, {incorrect: true, error});
        }

        // Set session expiration time to 1 day from now.
        const expirationTime = new Date();
        expirationTime.setDate(expirationTime.getDate() + 1);
        // Create a new session in the database and set a session cookie.
        const session = (await db.insert(sessions).values({userid: user.id, expirationTime}).returning())[0];
        event.cookies.set('sessionid', session.sessionid, {path: '/'});
        const {password: _, ...userClean} = user;
        event.locals.user = userClean;

        // Garbage-collect any expired sessions in the DB.
        await db.delete(sessions).where(lt(sessions.expirationTime, sql`now()`));

        // Redirect to the homepage after successful login.
        redirect(303, '/');
    },

    /**
     * Action to log a user out.
     * Deletes the user's session from the database and clears the session cookie.
     * @param event - The request event.
     * @returns A redirect to the login page or a failure response if no session is found.
     */
    logout: async (event) => {
        const sessionid = event.cookies.get('sessionid'); // Retrieve the session ID from the cookies.
        if (!sessionid) {
            return fail(400, {reason: 'Not logged in'}); // Return a failure response if no session ID is found.
        }

        // Delete the session from the database and clear the session cookie.
        await db.delete(sessions).where(eq(sessions.sessionid, sessionid));
        event.cookies.delete('sessionid', {path: '/'});
        event.locals.user = null;
        // Redirect to the login page after successful logout.
        redirect(303, '/login');
    },
};
