import { markApartmentComplete } from '$lib/db/db.server.js';
import { redirect } from '@sveltejs/kit';

// Actions object to handle server-side form submissions for marking an apartment as complete.
export const actions = {
    /**
     * Action to mark an apartment as complete.
     * Updates the status of the apartment in the database and redirects to the team's page.
     * @param event - The request event containing form data.
     * @returns A redirect to the team's page after the operation is successful.
     */
    markComplete: async (event) => {
        // Parse form data from the request.
        const formData = await event.request.formData();
        const contractid = parseInt(formData.get('contractid') as string); // Contract ID of the apartment.
        const floor = parseInt(formData.get('floor') as string); // Floor number of the apartment.
        const number = parseInt(formData.get('number') as string); // Apartment number.

        // Update the status of the apartment to 'complete' in the database.
        await markApartmentComplete(contractid, floor, number);

        // Redirect to the team's page after marking the apartment as complete.
        redirect(303, `/teams/${event.params.teamid}`);
    }
}
