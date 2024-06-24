import { getUserSession } from '$lib/db/db.server';
import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
    if (event.url.pathname === '/login' && !event.url.searchParams.has('/logout'))
        return await resolve(event);

	const sessionid = event.cookies.get('sessionid');
    if (!sessionid) {
        redirect(307, '/login');
    }

    const user = await getUserSession(sessionid);
    if (!user) {
        redirect(307, '/login');
    }
    
    const {password, ...rest} = user;
    event.locals.user = rest;
    const response = await resolve(event);
	return response;
}
