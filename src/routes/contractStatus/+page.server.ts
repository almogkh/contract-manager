import { getActiveContracts, updateItemQuantity, getItemByNWH, getApartmentsListById, updateContractStatus, createShortage } from "$lib/db/db.server";
import type { ContractStatus } from "$lib/db/schema.js";
import { fail, type Actions } from "@sveltejs/kit";

export async function load(event) {
    const contracts = await getActiveContracts();
    return { contracts };
}

export const actions: Actions = { 
    updateStatus: async (event) => {
        const formData = await event.request.formData();
        const id = parseInt(formData.get('id') as string);
        const status = formData.get('status') as ContractStatus;
        const dueDate = formData.get('dueDate') as string;

        if (isNaN(id))
            return fail(400, {missing: true});

        try {
            await updateContractStatus(id, status);
            
            if (status === 'inprogress') {
                const apartmentsInContract = await getApartmentsListById(id);
                for (const apt of apartmentsInContract) {
                    if (apt.windowWidth !== null && apt.windowHeight !== null) {
                        const window = await getItemByNWH('window', apt.windowWidth, apt.windowHeight);
                        if (window && window.quantity > 0) {
                            await updateItemQuantity(window.id);
                        } else if (window){
                            await createShortage(window.id, 1, dueDate);
                        }
                    }

                    if (apt.doorWidth !== null && apt.doorHeight !== null) {
                        console.log(apt.doorWidth);
                        const door = await getItemByNWH('Door', apt.doorWidth, apt.doorHeight);
                        if (door && door.quantity > 0) {
                            await updateItemQuantity(door.id);
                        } else if (door){
                            await createShortage(door.id, 1, dueDate);
                        }
                    }
                }
            }

            return { success: true, status: status };
        } catch (error) { 
            console.error("Error processing status:", error);
            return fail(500, { error: "Failed to process status" });
        }
    }
};
