import { getEmployeeTeams } from '$lib/db/db.server.js';

/**
 * Load function to fetch the list of teams associated with the current employee.
 * @param event - The load event from SvelteKit, containing request and route parameters.
 * @returns An object containing the list of teams to be used on the client side.
 */
export async function load(event) {
    // Retrieve the list of teams associated with the current user.
    const teamList = await getEmployeeTeams(event.locals.user!);

    // Return the list of teams to be used in the page.
    return {
        teams: teamList,
    };
}
