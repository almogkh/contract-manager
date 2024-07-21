import { addScheduleItem, getApartmentsList, getTeamsId,  } from "$lib/db/db.server";
import { fail, type Actions } from "@sveltejs/kit";

export async function load(event) {
    const team = await getTeamsId();
    const apartments = await getApartmentsList("pending");

    return {team, apartments};
}

export const actions: Actions = {
    updateSchedule: async (event) => {
        const formData = await event.request.formData();
        const teamId = formData.get('teamId') as string;
        const contractId = formData.get('contractId') as string;
        const date = formData.get('date') as string;
        const type = formData.get('type') as string;
        const description = formData.get('description') as string;
        // insert scedule to DB


        //addScheduleItem()

        // assign team to contractId
        try { 

        }
        catch (error) {
            console.error(error);
            return fail(500, { message: "Failed to update schedule." });
        }
    }
}