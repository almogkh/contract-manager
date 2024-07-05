import { markSchedItemComplete } from '$lib/db/db.server.js';

export const actions = {
    markComplete: async (event) => {
        const formData = await event.request.formData();
        const itemid = parseInt(formData.get('id') as string);

        await markSchedItemComplete(itemid);

        return {
            success: true,
        };
    }
}
