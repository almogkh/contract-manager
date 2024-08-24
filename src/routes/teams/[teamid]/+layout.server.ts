import { collectScheduleItems, getTeam, getTeamSchedule } from "$lib/db/db.server";

/**
 * Load function to fetch the team and its schedule.
 * @param event - The load event from SvelteKit, containing request and route parameters.
 * @returns An object containing the team data and the schedule data to be used on the client side.
 */
export async function load(event) {
    // Parse the team ID from the route parameters.
    const teamid = parseInt(event.params.teamid);

    // Fetch the team data based on the team ID.
    const team = await getTeam(teamid);

    // Fetch the schedule data for the specified team.
    const schedule = await getTeamSchedule(teamid);
    await collectScheduleItems(teamid);

    // Return the team and schedule data to be used in the page.
    return {
        team,
        schedule,
    };
}
