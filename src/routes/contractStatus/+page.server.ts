import { getContractsByStatus, updateContractStatus } from "$lib/db/db.server";
import  {fail, type Actions } from "@sveltejs/kit";

export async function load(event) {
    const contracts = await getContractsByStatus('inprogress');
    return { contracts };
}

export const actions: Actions = { 
    updateStatus: async (event) => {
        const formData = await event.request.formData();
        const id = parseInt(formData.get('id') as string);

        if (isNaN(id))
            return fail(400, {missing: true});

        try {
            await updateContractStatus(id, 'complete');
            return { success: true };
        } catch (error) {
            
        }
    }
};
