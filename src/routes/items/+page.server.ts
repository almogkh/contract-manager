import { deleteItem, getItems } from '$lib/db/db.server.js';
import { fail } from '@sveltejs/kit';

export async function load(event) {
    const items = await getItems();

    return {
        items,
    };
}

export const actions = {
    deleteItem: async (event) => {
        const formData = await event.request.formData();
        const id = parseInt(formData.get('id') as string);

        try {
            await deleteItem(id);
        } catch (error: any) {
            if (error.code === '23503') {
                return fail(400, {errorMessage: 'Can\'t delete item while it is referenced from different locations'});
            }
        }

        return {
            success: true,
        };
    },
};
