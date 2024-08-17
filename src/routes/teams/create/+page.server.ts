import { createTeam } from '$lib/db/db.server.js';
import { redirect } from '@sveltejs/kit';

export const actions = {
    createTeam: async (event) => {
        const formData = await event.request.formData();
        const name = formData.get('teamName') as string;
        const installers = formData.getAll('installer') as string[];

        await createTeam(name, event.locals.user!, installers);

        redirect(303, '/teams');
    },
};
