import { getUserSession } from '$lib/db/db.server';

export async function handle({ event, resolve }) {
    if (event.url.pathname === '/login')
        return await resolve(event);

    const redirectUrl = new URL(event.url);
    redirectUrl.pathname = '/login';
	const sessionid = event.cookies.get('sessionid');
    if (!sessionid) {
        return Response.redirect(redirectUrl, 307);
    }

    const user = await getUserSession(sessionid);
    if (!user) {
        return Response.redirect(redirectUrl, 307);
    }
    
    event.locals.user = user;
    const response = await resolve(event);
	return response;
}
