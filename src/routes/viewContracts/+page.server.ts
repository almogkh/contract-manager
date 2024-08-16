import { getContractsList } from "$lib/db/db.server";

export async function load() {
    const contracts = await getContractsList();
    return { contracts };
}
