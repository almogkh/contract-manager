import { createTeam } from '$lib/db/db.server.js';
import { redirect } from '@sveltejs/kit';

// Actions object to handle server-side form submissions for creating a new team.
export const actions = {
    /**
     * Action to create a new team.
     * Inserts the team details into the database and redirects to the teams page.
     * @param event - The request event containing form data.
     * @returns A redirect to the teams page after the operation is successful.
     */
    createTeam: async (event) => {
        // Parse form data from the request.
        const formData = await event.request.formData();
        const name = formData.get('teamName') as string; // Team name.
        const installers = formData.getAll('installer') as string[]; // List of installers.

        // Insert the new team into the database.
        await createTeam(name, event.locals.user!, installers);

        // Redirect to the teams page after successfully creating the team.
        redirect(303, '/teams');
    },
};
