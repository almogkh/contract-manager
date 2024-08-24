import { deleteTeam, editTeam } from '$lib/db/db.server.js';
import { fail, redirect } from '@sveltejs/kit';

// Actions object to handle server-side form submissions for editing and deleting teams.
export const actions = {
    /**
     * Action to edit a team's information.
     * Updates the team's name and its installers in the database.
     * @param event - The request event containing form data.
     * @returns An object indicating the success of the operation.
     */
    editTeam: async (event) => {
        // Parse form data from the request.
        const formData = await event.request.formData();
        const id = parseInt(formData.get('id') as string); // Team ID.
        const name = formData.get('teamName') as string; // Team name.
        const installers = formData.getAll('installer') as string[]; // List of installers.

        // Update the team's information in the database.
        await editTeam(id, name, installers);

        // Return success if the operation is completed.
        return {
            success: true,
        };
    },

    /**
     * Action to delete a team.
     * Removes the team from the database if it is not assigned to any work.
     * @param event - The request event containing form data.
     * @returns A redirect to the teams page after the operation is successful or an error response if deletion fails.
     */
    deleteTeam: async (event) => {
        // Parse form data from the request.
        const formData = await event.request.formData();
        const id = parseInt(formData.get('id') as string); // Team ID.

        try {
            // Attempt to delete the team from the database.
            await deleteTeam(id);
        } catch (error: any) {
            // Handle specific error when the team is assigned to some work.
            if (error.code === '23503') {
                return fail(400, {
                    errorMessage: 'Can\'t delete team because it is still assigned to some work.\nPlease request that the team is removed from all responsibility before trying to delete the team.',
                });
            }
        }

        // Redirect to the teams page after successfully deleting the team.
        redirect(303, '/teams');
    },
}
