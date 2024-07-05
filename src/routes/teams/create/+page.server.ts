import { createTeam } from '$lib/db/db.server.js';
import { redirect } from '@sveltejs/kit';

export const actions = {
    createTeam: async (event) => {
        const formData = await event.request.formData();
        const name = formData.get('teamName') as string;

        await createTeam(name, event.locals.user!);

        redirect(303, '/teams');
    },
};
