import { updateSchedule, deleteScheduleItem, addScheduleItem, getContractsByStatus, getTeams, getAllTeamSchedules } from "$lib/db/db.server";
import { fail, type Actions } from "@sveltejs/kit";
import type { WorkType } from '$lib/db/schema.js';

/**
 * Load function to fetch data required for scheduling.
 * @param event - The load event from SvelteKit, containing request and route parameters.
 * @returns An object containing teams, contracts, and schedules to be used on the client side.
 */
export async function load(event) {
    // Fetch teams, contracts, and schedules from the database.
    const team = await getTeams();
    const contracts = await getContractsByStatus('inprogress');
    const schedules = await getAllTeamSchedules();

    // Return data to be used in the page.
    return {team, contracts, schedules};
}

// Actions object to handle server-side form submissions for managing schedules.
export const actions: Actions = {
    /**
     * Action to add a new schedule item.
     * Inserts the schedule details into the database.
     * @param event - The request event containing form data.
     * @returns An object indicating the success of the operation or a failure message.
     */
    addSchedule: async (event) => {
        // Parse form data from the request.
        const formData = await event.request.formData();
        const teamId = parseInt(formData.get('teamId') as string);
        const contractId = parseInt(formData.get('contractId') as string);
        const date = formData.get('date') as string;
        const type = formData.get('type') as WorkType;
        const description = formData.get('description') as string;
        const floor = (formData.getAll('floor') as string[]).map(val => parseInt(val));
        const number = (formData.getAll('number') as string[]).map(val => parseInt(val));

        // Construct the apartments array from floors and numbers.
        const apartments = [];
        for (let i = 0; i < floor.length && i < number.length; i++) {
            apartments.push({floor: floor[i], number: number[i]});
        }

        // Create the schedule data object.
        const scheduleData = {
            contractid: contractId,
            date: date,
            itemType: type,
            teamid: teamId,
            description: description,
            apartments
        };

        // Validate the schedule data.
        if (!scheduleData)
            return fail(400, {missing: true});

        try {
            // Insert the new schedule item into the database.
            await addScheduleItem(scheduleData);
            return {success: true};
        } catch (error) {
            console.error(error);
            return fail(500, { message: "Failed to update schedule." });
        }
    },

    /**
     * Action to update an existing schedule item.
     * Updates the schedule details in the database.
     * @param event - The request event containing form data.
     * @returns An object indicating the success of the operation or a failure message.
     */
    updateSchedule: async (event) => {
        // Parse form data from the request.
        const formData = await event.request.formData();
        const teamId = parseInt(formData.get('teamId') as string);
        const contractId = parseInt(formData.get('contractId') as string);
        const date = formData.get('date') as string;
        const type = formData.get('type') as WorkType;
        const description = formData.get('description') as string;
        const scheduleid = formData.get("scheduleid") as string;
        const floor = (formData.getAll('floor') as string[]).map(val => parseInt(val));
        const number = (formData.getAll('number') as string[]).map(val => parseInt(val));

        // Construct the apartments array from floors and numbers.
        const apartments = [];
        for (let i = 0; i < floor.length && i < number.length; i++) {
            apartments.push({floor: floor[i], number: number[i]});
        }

        // Create the schedule data object.
        const scheduleData = {
            contractid: contractId,
            date: date,
            itemType: type,
            teamid: teamId,
            description: description,
            apartments,
        }

        // Validate the schedule data and schedule ID.
        if (!scheduleData || isNaN(parseInt(scheduleid)))
            return fail(400, {missing: true});
        
        try {
            // Update the existing schedule item in the database.
            await updateSchedule(scheduleData, parseInt(scheduleid));
            return {success: true};
        } catch (error) {
            console.error(error);
            return fail(500, { message: "Failed to update schedule." });
        }
    },

    /**
     * Action to delete a schedule item.
     * Removes the schedule item from the database.
     * @param event - The request event containing form data.
     * @returns An object indicating the success of the operation or a failure message.
     */
    deleteSchedule: async (event) => {
        // Parse form data from the request.
        const formData = await event.request.formData();
        const scheduleid = parseInt(formData.get('scheduleid') as string);

        try {
            // Delete the schedule item from the database.
            await deleteScheduleItem(scheduleid);
        } catch (error) {
            console.error(error);
            return fail(500, { message: "Failed to update schedule." });
        }
    }
}
