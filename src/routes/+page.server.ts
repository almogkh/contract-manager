import { pages } from '$lib/server/permissions';

/**
 * Load function for fetching user-specific page permissions.
 *
 * This function is used in a SvelteKit route to determine which pages or actions
 * a user has access to based on their role. The available pages/actions are filtered
 * according to the user's role, ensuring that each user only has access to the appropriate
 * sections of the application.
 *
 * @param {object} event - The event object provided by SvelteKit, containing details about
 * the current request, such as route parameters, cookies, and locals.
 * @returns {object} An object containing the `actions` property, which lists the pages or actions
 * the user is allowed to access based on their role.
 */
export function load(event) {
    // Retrieve the user from the event's locals. The user is assumed to be always present (non-null).
    const user = event.locals.user!;
    
    // Determine the actions/pages the user has access to based on their role.
    // If the user is a 'ceo', they have access to all pages.
    // Otherwise, the list is filtered based on the user's specific role.
    const actions = user.role === 'ceo' ? pages : pages.filter((page) => page.roles.includes(user.role));

    return {
        actions, // Return the filtered list of actions/pages for the user.
    }
}
