import { getActiveContracts, updateContractStatus } from "$lib/db/db.server";
import type { ContractStatus } from "$lib/db/schema.js";
import  {fail, type Actions } from "@sveltejs/kit";

export async function load(event) {
    const contracts = await getActiveContracts();
    return { contracts };
}

export const actions: Actions = { 
    updateStatus: async (event) => {
        const formData = await event.request.formData();
        const id = parseInt(formData.get('id') as string);
        const status = formData.get('status') as ContractStatus;

        if (isNaN(id))
            return fail(400, {missing: true});

        try {
            await updateContractStatus(id, status);
            return { success: true };
        } catch (error) { 
            return fail(500, {error});
        }
    }
};
