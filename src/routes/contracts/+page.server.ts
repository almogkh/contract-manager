import { getItemsData, addContract, addApartment } from '$lib/db/db.server.js';
import { type ContractStatus, type ContractType, apartmentStatus } from '$lib/db/schema.js';
import { fail } from '@sveltejs/kit';

export async function load(event) {
    const items = await getItemsData();
    return { items };
}

export const actions = {
    createContract: async ({ request }) => {
        const formData = await request.formData();
        const address = formData.get('address') as string;
        const signingDate = formData.get('signingDate') as string;
        const price = parseFloat(formData.get('price') as string);
        const dueDate = formData.get('dueDate') as string;
        const type = formData.get('contractType') as ContractType;
        const status = formData.get('contractStatus') as ContractStatus;

        // Extract apartments data
        const apartmentDataStr = formData.get('apartments') as string;
        
        const data = [
            address,
            signingDate,
            price,
            dueDate,
            type,
            status
        ];
        // Validate contract data
        if (!data.every((value) => value !== null && value !== '')) 
            return fail(400, { missing: true });
        
        // Validate apartments list
        if (!apartmentDataStr) {
            return fail(400, { missingApartments: true });
        }
        
        const apartmentData = JSON.parse(apartmentDataStr);            
        
        // Validate apartment status
        for (const apartment of apartmentData) {
            if (!apartmentStatus.enumValues.includes(apartment.aptStatus)) {
                return fail(400, { message: "Invalid apartment status." });
            }
        }
        
        try {
            // Insert a new contract and return the contract
            const result = await addContract({address, signingDate, price, dueDate, type, status});

            // Extract contract id
            const contractid = result[0].id;

            // Insert each apartment
            for (const apartment of apartmentData) {
                const { floor, number, aptItems, aptStatus } = apartment;

                // Initialize default values for door and window dimensions
                let doorWidth = null;
                let doorHeight = null;
                let windowWidth = null;
                let windowHeight = null;

                // Process items to extract dimensions
                for (const item of aptItems) {
                    if (item.name === "Door") {
                        doorWidth = parseFloat(item.width);
                        doorHeight = parseFloat(item.height);
                    } else if (item.name.toLowerCase() === "Window") {
                        windowWidth = parseFloat(item.width);
                        windowHeight = parseFloat(item.height);
                    }
                }

                const aptData = {
                    contractid,
                    floor: parseInt(floor),
                    number: parseInt(number),
                    windowWidth,
                    windowHeight,
                    doorWidth,
                    doorHeight,
                    status: aptStatus
                };

                if (isNaN(floor) || isNaN(number)){
                    return fail(400, { message: "Invalid apartment floor/number." });
                }

                await addApartment(aptData);
            }

            return { success: true };
        } catch (error) {
            console.error(error);
            return fail(500, { message: "Failed to create contract and apartments." });
        }
    }
};
