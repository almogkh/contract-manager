import { db /*,getContractById*/ } from '$lib//db/db.server.js';
import { contracts, type StatusType, type ContractType } from '$lib/db/schema.js';
import { fail } from '@sveltejs/kit';

/*
export async function load(event) {
    const contract = await getContractById(45);
    return {
        contract,
    };
}
*/

export const actions = {
    createContract: async ({ request }) => {
        const formData = await request.formData();
        const address = formData.get('address') as string;
        const signingDate = formData.get('signingDate') as string;
        const price = parseFloat(formData.get('price') as string);
        const dueDate = formData.get('dueDate') as string;
        const type = formData.get('contractType') as ContractType;
        const status = formData.get('contractStatus') as  StatusType;

        const data = [address, signingDate, price, dueDate, type, status];

        if (!data.every((value) => value !== null && value !== '')) 
          return fail(400, { missing: true });


        try {
           await db.insert(contracts).values({
            address,
            signingDate,
            price,
            dueDate,
            contractType: type,
            contractStatus: status,
        });
            return { success: true };
        } catch (error) {
            console.error(error);
            return fail(500, { message: "Failed to create contract." });
        }
    }
};