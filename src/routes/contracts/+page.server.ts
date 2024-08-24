import { getItemsData, addContract, addApartment, addFloorDueDates } from '$lib/db/db.server.js';
import { type ContractStatus, type ContractType, type DueDate, apartmentStatus } from '$lib/db/schema.js';
import { fail } from '@sveltejs/kit';

/**
 * Load function to fetch initial data for the page.
 * @param event - The load event from SvelteKit.
 * @returns An object containing the items data to be used on the client side.
 */
export async function load(event) {
    // Fetch items data from the database
    const items = await getItemsData();
    return { items };
}

// Actions object to handle server-side form submissions
export const actions = {
    /**
     * Action to create a new contract along with its associated apartments and due dates.
     * @param request - The request object from the client containing form data.
     * @returns An object indicating success or failure of the operation.
     */
    createContract: async ({ request }) => {
        // Parse form data from the request
        const formData = await request.formData();
        const address = formData.get('address') as string;
        const signingDate = formData.get('signingDate') as string;
        const price = parseFloat(formData.get('price') as string);
        const dueDate = formData.get('dueDate') as string;
        const type = formData.get('contractType') as ContractType;
        const floors = (formData.getAll("dueDateFloor") as string[]).map(val => parseInt(val));
        const floorDueDates = formData.getAll("dueDateDate") as string[];
        const apartmentDataStr = formData.get('apartments') as string;
        
        // Change the code so that the due date will be by apartments and not by contracts
        
        const data = [address, signingDate, price, dueDate, type];
        
        // Validate contract data; ensure all fields are filled
        if (!data.every((value) => value !== null && value !== '')) 
            return fail(400, { missing: true });
        
        // Validate apartments list; ensure it is provided
        if (!apartmentDataStr) {
            return fail(400, { missingApartments: true });
        }
        
        const apartmentData = JSON.parse(apartmentDataStr);            
        
        // Validate apartment status; ensure status is valid
        for (const apartment of apartmentData) {
            if (!apartmentStatus.enumValues.includes(apartment.aptStatus)) {
                return fail(400, { message: "Invalid apartment status." });
            }
        }
        
        try {
            // Insert a new contract into the database
            const result = await addContract({address, signingDate, price, dueDate, type});

            // Extract contract ID from the result
            const contractid = result[0].id;

            // Insert each apartment associated with the contract
            for (const apartment of apartmentData) {
                const { floor, number, aptItems, aptStatus } = apartment;

                // Initialize default values for door and window dimensions
                let doorWidth = null;
                let doorHeight = null;
                let windowWidth = null;
                let windowHeight = null;

                // Process items to extract dimensions for doors and windows
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

                // Validate floor and number; ensure they are numbers
                if (isNaN(floor) || isNaN(number)){
                    return fail(400, { message: "Invalid apartment floor/number." });
                }

                // Insert the apartment into the database
                await addApartment(aptData);
            }

            // Prepare due dates for each floor and insert them into the database
            const dueDates: DueDate[] = [];
            for (let i = 0; i < floors.length && i < floorDueDates.length; i++) {
                dueDates.push({contractid, floor: floors[i], date: floorDueDates[i]});
            }
            await addFloorDueDates(dueDates);

            return { success: true };
        } catch (error) {
            console.error(error);
            return fail(500, { message: "Failed to create contract and apartments." });
        }
    }
};
