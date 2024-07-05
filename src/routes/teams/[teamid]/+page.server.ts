import { deleteTeam, editTeam, markSchedItemComplete } from '$lib/db/db.server.js';
import { redirect } from '@sveltejs/kit';

export const actions = {
    markComplete: async (event) => {
        const formData = await event.request.formData();
        const itemid = parseInt(formData.get('id') as string);

        await markSchedItemComplete(itemid);

        return {
            success: true,
        };
    },

    editTeam: async (event) => {
        const formData = await event.request.formData();
        const id = parseInt(formData.get('id') as string);
        const name = formData.get('teamName') as string;

        await editTeam(id, name);

        return {
            success: true,
        };
    },

    deleteTeam: async (event) => {
        const formData = await event.request.formData();
        const id = parseInt(formData.get('id') as string);

        try {
            await deleteTeam(id);
        } catch (error: any) {
            if (error.code === '23503') {
                return {
                    errorMessage: 'Can\'t delete team because it is still assigned to some work.\nPlease request that the team is removed from all responsibility before trying to delete the team.',
                };
            }
        }

        redirect(303, '/teams');
    },
}
