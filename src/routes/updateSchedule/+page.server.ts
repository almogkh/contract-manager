import { updateSchedule, deleteScheduleItem, addScheduleItem, getContractsByStatus, getTeams, getAllTeamSchedules } from "$lib/db/db.server";
import { fail, type Actions } from "@sveltejs/kit";
import type { WorkType } from '$lib/db/schema.js';

export async function load(event) {
    const team = await getTeams();
    const contracts = await getContractsByStatus('inprogress');
    const schedules = await getAllTeamSchedules();

    return {team, contracts, schedules};
}

export const actions: Actions = {
    addSchedule: async (event) => {
        const formData = await event.request.formData();
        const teamId = parseInt(formData.get('teamId') as string);
        const contractId = parseInt(formData.get('contractId') as string);
        const date = formData.get('date') as string;
        const type = formData.get('type') as WorkType;
        const description = formData.get('description') as string;
        const floor = (formData.getAll('floor') as string[]).map(val => parseInt(val));
        const number = (formData.getAll('number') as string[]).map(val => parseInt(val));

        const apartments = [];
        for (let i = 0; i < floor.length && i < number.length; i++) {
            apartments.push({floor: floor[i], number: number[i]});
        }

        const scheduleData = {
            contractid: contractId,
            date: date,
            itemType: type,
            teamid: teamId,
            description: description,
            apartments
        };

        if (!scheduleData)
            return fail(400, {missing: true});

        try{
            await addScheduleItem(scheduleData);   

            return {success: true}
        }
        catch (error) {
            console.error(error);
            return fail(500, { message: "Failed to update schedule." });
        }
    },
    updateSchedule: async (event) => {
        const formData = await event.request.formData();
        const teamId = parseInt(formData.get('teamId') as string);
        const contractId = parseInt(formData.get('contractId') as string);
        const date = formData.get('date') as string;
        const type = formData.get('type') as WorkType;
        const description = formData.get('description') as string;
        const scheduleid = formData.get("scheduleid") as string;
        const floor = (formData.getAll('floor') as string[]).map(val => parseInt(val));
        const number = (formData.getAll('number') as string[]).map(val => parseInt(val));

        const apartments = [];
        for (let i = 0; i < floor.length && i < number.length; i++) {
            apartments.push({floor: floor[i], number: number[i]});
        }

        const scheduleData = {
            contractid: contractId,
            date: date,
            itemType: type,
            teamid: teamId,
            description: description,
            apartments,
        }

        if (!scheduleData || isNaN(parseInt(scheduleid)))
            return fail(400, {missing: true});
        
        try{
            
            await updateSchedule(scheduleData, parseInt(scheduleid));
            return {success: true}
        }
        catch (error) {
            console.error(error);
            return fail(500, { message: "Failed to update schedule." });
        }
    },
    deleteSchedule: async (event) => {
        const formData = await event.request.formData();
        const scheduleid = parseInt(formData.get('scheduleid') as string);

        try{
            await deleteScheduleItem(scheduleid);
        }
        catch (error) {
            console.error(error);
            return fail(500, { message: "Failed to update schedule." });
        }
    }
}
