import { deleteItem, getItems, updateItem } from '$lib/db/db.server.js';
import { fail } from '@sveltejs/kit';

export async function load(event) {
    const items = await getItems();

    return {
        items,
    };
}

export const actions = {
    editItem: async (event) => {
        const formData = await event.request.formData();
        const id = parseInt(formData.get('id') as string);
        const name = formData.get('name') as string;
        const price = parseInt(formData.get('price') as string);
        const quantity = parseInt(formData.get('quantity') as string);
        const maybeWidth = parseInt(formData.get('width') as string);
        const maybeHeight = parseInt(formData.get('height') as string);

        const width = isNaN(maybeWidth) ? null : maybeWidth;
        const height = isNaN(maybeHeight) ? null : maybeHeight;

        await updateItem({id, name, price, quantity, width, height});

        return {success: true};
    },

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
