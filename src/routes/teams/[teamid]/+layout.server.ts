import { getTeam, getTeamSchedule } from "$lib/db/db.server";

export async function load(event) {
    const teamid = parseInt(event.params.teamid);
    const team = await getTeam(teamid);
    const schedule = await getTeamSchedule(teamid);
    const sortedSchedule = Object.values(schedule).toSorted((a, b) => a.item.time.getTime() - b.item.time.getTime());

    return {
        team,
        schedule: sortedSchedule,
    };
}
