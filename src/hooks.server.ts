import { getUserSession } from '$lib/db/db.server';
import { pages } from '$lib/server/permissions';
import { error, redirect } from '@sveltejs/kit';

/**
 * Handle function for server-side middleware in SvelteKit.
 * 
 * This function is used to manage authentication and authorization for incoming requests.
 * It checks if the user is authenticated and authorized to access the requested route, 
 * and redirects them to the login page if they are not.
 *
 * @param {object} event - The event object provided by SvelteKit, containing details about
 * the current request, such as route parameters, cookies, and locals.
 * @param {function} resolve - The function to call to continue processing the request and produce a response.
 * @returns {Promise<Response>} The response after processing the request.
 */
export async function handle({ event, resolve }) {
    // Initialize the user in locals to null to ensure it's cleared for each request
    event.locals.user = null;

    // If the request is for the login page, proceed without further checks
    if (event.url.pathname === '/login')
        return await resolve(event);
    
    // Retrieve the session ID from cookies
    const sessionid = event.cookies.get('sessionid');
    if (!sessionid) {
        // Redirect to the login page if no session ID is found
        redirect(303, '/login');
    }

    // Fetch the user based on the session ID
    const user = await getUserSession(sessionid);
    if (!user) {
        // Redirect to the login page if no user is found for the session ID
        redirect(303, '/login');
    }
    
    // Perform route-based authorization checks, except for the root path
    if (event.url.pathname !== '/') {
        // Find the page configuration that matches the current path
        const route = pages.find((page) => event.url.pathname.startsWith(page.route));
        if (!route)
            // Return a 404 error if the route is not found in the pages configuration
            error(404);

        // If the user is not a 'ceo' and their role is not listed in the allowed roles for the route, return a 403 error
        if (user.role !== 'ceo' && !route.roles.includes(user.role))
            error(403);
    }

    // Strip the password from the user object for security reasons
    const {password, ...rest} = user;
    // Attach the sanitized user object to locals for access in the rest of the application
    event.locals.user = rest;
    // Continue with processing the request
    const response = await resolve(event);
    return response;
}
