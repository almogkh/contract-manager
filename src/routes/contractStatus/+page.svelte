<script lang="ts">
    import { enhance } from "$app/forms";

    export let data;

    // Define the type of the status array as an array of strings
    let status: string[] = [];

    $: sortedContracts = data.contracts.slice().sort((a, b) => a.id - b.id);

    // Initialize the status array with the current status of each contract
    $: {
        if (sortedContracts.length > 0 && status.length === 0) {
            status = sortedContracts.map(contract => contract.status);
        }
    }
</script>

<div class="text-2xl grid grid-cols-4 gap-4 p-8">
    <span class="border-b-2 border-black pb-2 col-span-1 font-bold">Contract ID</span>
    <span class="border-b-2 border-black pb-2 col-span-1 font-bold">Current</span>
    <span class="border-b-2 border-black pb-2 col-span-1 font-bold">New Status</span>
    <span class="border-b-2 border-black pb-2 col-span-1 font-bold"></span>
</div>
    {#each sortedContracts as contract, index}

<form method="post" action="?/updateStatus" use:enhance={({ action }) => {
    return ({ update }) => {
        update({ reset: false });
    };
}} class="text-xl grid grid-cols-4 gap-4 border-b-4 border-gray-500 py-2">
        <div class="col-span-4 grid grid-cols-4 gap-4  border-gray-500 py-2">
            <span>{contract.id}</span>
            <span>{contract.status === 'new' ? 'New' : 'In Progress'}</span>
            <select name="status" bind:value={status[index]} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <option value="new">New</option>
                <option value="inprogress">In Progress</option>
                <option value="complete">Complete</option>
            </select>
            <input type="hidden" name="id" value={contract.id}>
            <button class="bg-green-500 hover:bg-green-700 text-white py-1.5 px-2 rounded focus:outline-none focus:shadow-outline">
                Save
            </button>
        </div>
    </form>
    {/each}
