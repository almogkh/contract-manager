import { addItem, deleteItem, getItems, updateItem } from '$lib/db/db.server.js';
import { fail } from '@sveltejs/kit';

/**
 * Load function to fetch the list of items.
 * @param event - The load event from SvelteKit.
 * @returns An object containing the list of items to be used on the client side.
 */
export async function load(event) {
    const items = await getItems(); // Fetch the list of items from the database.

    return {
        items, // Return the items list to be used in the page.
    };
}

// Actions object to handle server-side form submissions for item management.
export const actions = {
    /**
     * Action to add or edit an item in the database.
     * If an ID is provided, updates the existing item; otherwise, adds a new item.
     * @param event - The request event containing form data.
     * @returns An object indicating success or failure of the operation.
     */
    editItem: async (event) => {
        const formData = await event.request.formData(); // Parse form data from the request.
        const id = parseInt(formData.get('id') as string); // Item ID, used to determine if we're adding or updating.
        const name = formData.get('name') as string; // Item name.
        const price = parseFloat(formData.get('price') as string); // Item price.
        const quantity = parseInt(formData.get('quantity') as string); // Item quantity.
        const maybeWidth = parseFloat(formData.get('width') as string); // Item width, may be NaN.
        const maybeHeight = parseFloat(formData.get('height') as string); // Item height, may be NaN.

        // Convert NaN width and height to null for database compatibility.
        const width = isNaN(maybeWidth) ? null : maybeWidth;
        const height = isNaN(maybeHeight) ? null : maybeHeight;

        // Check if an item ID is provided.
        if (isNaN(id)) {
            // If no ID is provided, add a new item to the database.
            await addItem({name, price, quantity, width, height});
        } else {
            // If an ID is provided, update the existing item in the database.
            await updateItem({id, name, price, quantity, width, height});
        }

        return {success: true}; // Return success if the operation is completed.
    },

    /**
     * Action to delete an item from the database.
     * Validates that the item can be deleted (i.e., it is not referenced elsewhere).
     * @param event - The request event containing form data.
     * @returns An object indicating success or failure of the operation.
     */
    deleteItem: async (event) => {
        const formData = await event.request.formData(); // Parse form data from the request.
        const id = parseInt(formData.get('id') as string); // Item ID to be deleted.

        try {
            // Attempt to delete the item from the database.
            await deleteItem(id);
        } catch (error: any) {
            // If a foreign key constraint violation occurs, return an appropriate error message.
            if (error.code === '23503') {
                return fail(400, {errorMessage: 'Can\'t delete item while it is referenced from different locations'});
            }
        }

        return {
            success: true, // Return success if the operation is completed.
        };
    },
};
