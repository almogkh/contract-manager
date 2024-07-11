import { db } from '$lib/db/db.server.js';
import { apartments, contracts, type ContractStatus, type ContractType, apartmentStatus } from '$lib/db/schema.js';
import { fail } from '@sveltejs/kit';

export const actions = {
    createContract: async ({ request }) => {
        const formData = await request.formData();
        const address = formData.get('address') as string;
        const signingDate = formData.get('signingDate') as string;
        const price = parseFloat(formData.get('price') as string);
        const dueDate = formData.get('dueDate') as string;
        const type = formData.get('contractType') as ContractType;
        const status = formData.get('contractStatus') as ContractStatus;

        const apartmentDataStr = formData.get('apartments') as string;
        
        const data = [
            address,
            signingDate,
            price,
            dueDate,
            type,
            status
        ];
        
        if (!data.every((value) => value !== null && value !== '')) 
            return fail(400, { missing: true });
        
        try {
            // Insert a new contract and return the contractId of the inserted row
            const result = await db.insert(contracts).values({
                address,
                signingDate,
                price,
                dueDate,
                type,
                status,
            }).returning();
            
            // Extract apartments data            
            if (!apartmentDataStr) {
                return fail(400, { missingApartments: true });
            }
            const apartmentData = JSON.parse(apartmentDataStr);            
            
            // Validate apartment status
            for (const apartment of apartmentData) {
                if (!apartmentStatus.enumValues.includes(apartment.aptStstus)) {
                    return fail(400, { message: "Invalid apartment status." });
                }
            }

            // Insert each apartment
            const contractid = result[0].id;
            for (const apartment of apartmentData) {
                const { floor, number, windowWidth, windowHeight, doorWidth, doorHeight, aptStstus } = apartment;

                if ( isNaN(parseInt(floor)) || isNaN(parseInt(number))){
                    return fail(400, { message: "Invalid apartment floor/number." });
                }

                await db.insert(apartments).values({
                    contractid,
                    floor: parseInt(floor),
                    number: parseInt(number),
                    windowWidth: parseFloat(windowWidth),
                    windowHeight: parseFloat(windowHeight),
                    doorWidth: parseFloat(doorWidth),
                    doorHeight: parseFloat(doorHeight),
                    status: aptStstus,
                });
            }

            return { success: true };
        } catch (error) {
            console.error(error);
            return fail(500, { message: "Failed to create contract and apartments." });
        }
    }
};
