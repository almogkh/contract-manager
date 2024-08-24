/**
 * Load function for fetching user data from the server.
 *
 * This function is a server-side load function used in a SvelteKit route. It retrieves the user data
 * stored in the `locals` object of the `event` parameter. This is typically set earlier in the request
 * lifecycle, for example, during an authentication check.
 *
 * @param {object} event - The event object provided by SvelteKit, which contains information about the
 * current request, such as parameters, cookies, and locals.
 * @returns {object} An object containing the `user` property, which holds the user data fetched from
 * `event.locals.user`.
 */
export function load(event) {
    return {
        user: event.locals.user, // Fetches the user data from the event's locals
    };
}
