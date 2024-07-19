import { getApartmentsList, markApartmentComplete } from "$lib/db/db.server";
import type { Actions } from "@sveltejs/kit";

export async function load(event) {
    const apartmentsList = await getApartmentsList('pending');
    return { apartmentsList };
}

export const actions: Actions = { 
    updateStatus: async (event) => {
        const formData = await event.request.formData();
        const id = parseInt(formData.get('id') as string);
        const floor = parseInt(formData.get('floor') as string);
        const number = parseInt(formData.get('number') as string);

        console.log(id, floor, number)
        try {
            await markApartmentComplete(id, floor, number);
            return { success: true };
        } catch (error) {
            
        }
    }
};
