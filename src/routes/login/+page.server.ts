import { db } from '$lib/db/db.server.js';
import { sessions, users } from '$lib/db/schema.js';
import { computeHash } from '$lib/server/utils.js';
import { fail, redirect } from '@sveltejs/kit';
import { and, eq, gt, sql } from 'drizzle-orm';

export const actions = {
    login: async (event) => {
        const formData = await event.request.formData();
        const username = formData.get('username') as string | null;
        const password = formData.get('password') as string | null;
        const error = 'Username or password are incorrect!';

        if (!username || !password) {
            return fail(400, {missing: true, error});
        }

        // Make username case-insensitive
        const arr = username.toLowerCase().split('.');
        // Username is always firsName.lastName
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
            console.log(passHash, user.password);
            return fail(400, {incorrect: true, error});
        }

        const expirationTime = new Date();
        expirationTime.setDate(expirationTime.getDate() + 1);
        const session = (await db.insert(sessions).values({userid: user.id, expirationTime}).returning())[0];
        event.cookies.set('sessionid', session.sessionid, {path: '/'});
        const {password: _, ...userClean} = user;
        event.locals.user = userClean;

        // Garbage-collect any expired sessions in the DB
        await db.delete(sessions).where(gt(sessions.expirationTime, sql`now()`));

        redirect(303, '/');
    },

    logout: async (event) => {
        const sessionid = event.cookies.get('sessionid');
        if (!sessionid) {
            return fail(400, {reason: 'Not logged in'});
        }

        await db.delete(sessions).where(eq(sessions.sessionid, sessionid));
        event.cookies.delete('sessionid', {path: '/'});
        event.locals.user = null;
        redirect(303, '/login');
    },
};
