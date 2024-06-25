import { pages } from '$lib/server/permissions';

export function load(event) {
    const user = event.locals.user;
    const actions = pages.filter((page) => page.roles.includes(user.role));

    return {
        actions,
    }
}
