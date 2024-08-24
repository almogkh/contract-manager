import { getShortages, updateShortage } from '$lib/db/db.server.js';
import type { ShortageStatus } from '$lib/db/schema.js';

/**
 * Load function to fetch the list of shortages.
 * @param event - The load event from SvelteKit.
 * @returns An object containing the list of shortages to be used on the client side.
 */
export async function load(event) {
    // Fetch the list of shortages from the database.
    const shortages = await getShortages();

    // Return the shortages list to be used in the page.
    return {
        shortages,
    };
}

// Actions object to handle server-side form submissions for updating shortages.
export const actions = {
    /**
     * Action to update the status of a shortage.
     * Changes the status of the shortage based on the current status ('pending' -> 'ordered', 'ordered' -> 'complete').
     * @param event - The request event containing form data.
     * @returns An object indicating success of the operation.
     */
    updateShortage: async (event) => {
        // Parse form data from the request.
        const formData = await event.request.formData();
        const id = parseInt(formData.get('id') as string); // Shortage ID.
        const status = formData.get('status') as ShortageStatus; // Current shortage status.

        // Update the shortage status based on its current state.
        await updateShortage(id, status === 'pending' ? 'ordered' : 'complete');

        // Return success if the operation is completed.
        return {
            success: true,
        };
    },
};
