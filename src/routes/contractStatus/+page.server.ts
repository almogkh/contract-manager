import { getActiveContracts, getApartmentsList, updateItemQuantity, updateApartmentStatus, getItemByNWH, getApartmentsListById, updateContractStatus, createShortage } from "$lib/db/db.server";
import type { ContractStatus } from "$lib/db/schema.js";
import { fail, type Actions } from "@sveltejs/kit";

/**
 * Load function to fetch active contracts and apartments.
 * @param event - The load event from SvelteKit.
 * @returns An object containing active contracts and apartments data to be used on the client side.
 */
export async function load(event) {
    const contracts = await getActiveContracts(); // Fetch active contracts from the database.
    const apartments = await getApartmentsList(); // Fetch a list of all apartments from the database.
    return { contracts, apartments }; // Return the fetched data to be used in the page.
}

// Actions object to handle server-side form submissions and other actions.
export const actions: Actions = { 
    /**
     * Action to update the status of a contract.
     * When a contract status is updated to 'inprogress', checks the availability of required items and updates their quantity.
     * Creates shortages if items are not available.
     * @param event - The request event containing form data.
     * @returns An object indicating success or failure of the operation.
     */
    updateContractStatus: async (event) => {
        // Parse form data from the request
        const formData = await event.request.formData();
        const id = parseInt(formData.get('id') as string); // Get the contract ID from the form data.
        const status = formData.get('status') as ContractStatus; // Get the contract status from the form data.
        const dueDate = formData.get('dueDate') as string; // Get the due date from the form data.

        // Validate the contract ID; ensure it is a number.
        if (isNaN(id))
            return fail(400, { missing: true });

        try {
            // Update the contract status in the database.
            await updateContractStatus(id, status);
            
            // If the contract status is set to 'inprogress', proceed with checking item availability.
            if (status === 'inprogress') {
                // Fetch apartments associated with the contract.
                const apartmentsInContract = await getApartmentsListById(id);
                for (const apt of apartmentsInContract) {
                    // Check and update item quantity for windows in the apartment.
                    if (apt.windowWidth !== null && apt.windowHeight !== null) {
                        const window = await getItemByNWH('window', apt.windowWidth, apt.windowHeight);
                        if (window && window.quantity > 0) {
                            await updateItemQuantity(window.id);
                        } else if (window) {
                            await createShortage(window.id, 1, dueDate); // Create a shortage if the item is not available.
                        }
                    }

                    // Check and update item quantity for doors in the apartment.
                    if (apt.doorWidth !== null && apt.doorHeight !== null) {
                        const door = await getItemByNWH('Door', apt.doorWidth, apt.doorHeight);
                        if (door && door.quantity > 0) {
                            await updateItemQuantity(door.id);
                        } else if (door) {
                            await createShortage(door.id, 1, dueDate); // Create a shortage if the item is not available.
                        }
                    }
                }
            }
            return { success: true }; // Return success if the operation is completed without errors.
        } catch (error) { 
            console.error("Error processing status:", error); // Log the error for debugging purposes.
            return fail(500, { error: "Failed to process status" }); // Return a failure response if an error occurs.
        }
    }
};
