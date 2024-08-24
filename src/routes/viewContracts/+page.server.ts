import { getContractsList, getFloorDueDates } from "$lib/db/db.server";

/**
 * Asynchronously loads data required for the page.
 *
 * This function fetches the list of contracts and their associated floor due dates from the database.
 * It then combines this data so that each contract includes its corresponding floor due dates.
 *
 * @returns {Promise<{ contracts: Array<{ id: number; name: string; ...rest: any; floorDueDates: Array<{ contractid: number; floor: number; date: string }> }> }>}
 * An object containing a list of contracts, where each contract includes its associated floor due dates.
 */
export async function load() {
    // Fetch a list of all contracts from the database.
    const contractsList = await getContractsList();

    // Fetch all floor due dates associated with the contracts from the database.
    const dueDates = await getFloorDueDates();

    /**
     * An array to hold the contracts with their associated floor due dates.
     * Each element in the array is an object that combines the contract data with its corresponding floor due dates.
     */
    const contracts: (typeof contractsList[number] & { floorDueDates: typeof dueDates })[] = [];

    // Iterate over each contract in the fetched contracts list.
    for (const contract of contractsList) {
        /**
         * Create a new object that contains all properties of the contract and a new property, `floorDueDates`.
         * The `floorDueDates` property is an array of due dates that have the same `contractid` as the current contract.
         */
        const newData: typeof contracts[number] = {
            ...contract,
            floorDueDates: dueDates.filter(val => val.contractid === contract.id),
        };

        // Add the newly created object to the contracts array.
        contracts.push(newData);
    }

    // Return the contracts array wrapped in an object.
    // This object will be passed to the Svelte page as props.
    return { contracts };
}
