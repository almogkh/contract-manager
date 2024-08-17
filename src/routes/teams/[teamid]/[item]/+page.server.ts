import { markApartmentComplete } from '$lib/db/db.server.js';
import { redirect } from '@sveltejs/kit';

export const actions = {
    markComplete: async (event) => {
        const formData = await event.request.formData();
        const contractid = parseInt(formData.get('contractid') as string);
        const floor = parseInt(formData.get('floor') as string);
        const number = parseInt(formData.get('number') as string);

        await markApartmentComplete(contractid, floor, number);

        redirect(303, `/teams/${event.params.teamid}`);
    }
}
