import { getEmployeeTeams } from '$lib/db/db.server.js';

export async function load(event) {
    const teamList = await getEmployeeTeams(event.locals.user!);
    return {
        teams: teamList,
    };
}
