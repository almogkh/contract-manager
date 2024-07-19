import { addScheduleItem, getTeamsLeads } from "$lib/db/db.server";
import { fail, type Actions } from "@sveltejs/kit";

export async function load(event) {
    const teamleads = await getTeamsLeads();
    return {teamleads};
}

export const actions: Actions = {
    updateSchedule: async (event) => {
        const formData = await event.request.formData();
        


        try { 

        }
        catch (error) {
            console.error(error);
            return fail(500, { message: "Failed to update schedule." });
        }
    }
}