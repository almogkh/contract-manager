import { getApartmentsList, getApartmentsListById } from "$lib/db/db.server";
import type { ContractStatus } from "$lib/db/schema.js";
import type { Actions } from "@sveltejs/kit";

export async function load(event){
    const apartmentsList = await getApartmentsList();

    return { apartmentsList };
}

export const actions: Actions = { 
    getApartmentsListById: async (event) => {
        const formData = await event.request.formData();
        const id = parseInt(formData.get('id') as string);

        const apartmentsList = await getApartmentsListById(id);

        return { success: true, apartmentsList };
    }
};
