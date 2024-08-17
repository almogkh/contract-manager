import { getShortages, updateShortage } from '$lib/db/db.server.js';
import type { ShortageStatus } from '$lib/db/schema.js';

export async function load(event) {
    const shortages = await getShortages();

    return {
        shortages,
    };
}

export const actions = {
    updateShortage: async (event) => {
        const formData = await event.request.formData();
        const id = parseInt(formData.get('id') as string);
        const status = formData.get('status') as ShortageStatus;

        await updateShortage(id, status === 'pending' ? 'ordered' : 'complete');

        return {
            success: true,
        };
    },
};
