import { getContractsList, getFloorDueDates } from "$lib/db/db.server";

export async function load() {
    const contractsList = await getContractsList();
    const dueDates = await getFloorDueDates();

    const contracts: (typeof contractsList[number] & {floorDueDates: typeof dueDates})[] = [];
    for (const contract of contractsList) {
        const newData: typeof contracts[number] = {...contract, floorDueDates: dueDates.filter(val => val.contractid === contract.id)};
        contracts.push(newData);
    }

    return { contracts };
}
