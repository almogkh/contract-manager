import { getUserSession } from '$lib/db/db.server';
import { pages } from '$lib/server/permissions';
import { error, redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
    event.locals.user = null;

    if (event.url.pathname === '/login')
        return await resolve(event);
    
    // User must be logged in. If they're not, redirect to login page
    const sessionid = event.cookies.get('sessionid');
    if (!sessionid) {
        redirect(303, '/login');
    }

    const user = await getUserSession(sessionid);
    if (!user) {
        redirect(303, '/login');
    }
    
    // Everyone can access the homepage
    if (event.url.pathname !== '/') {
        const route = pages.find((page) => event.url.pathname.startsWith(page.route));
        if (!route)
            error(404);

        // CEO can access all pages
        if (user.role !== 'ceo' && !route.roles.includes(user.role))
            error(403);
    }

    // Don't send the user's password to the client
    const {password, ...rest} = user;
    event.locals.user = rest;
    const response = await resolve(event);
    return response;
}
