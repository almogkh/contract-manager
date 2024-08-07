<script lang="ts">
    import { enhance } from "$app/forms";

    export let data;

    // Define the type of the status array as an array of strings
    let status: string[] = [];
    let toggleBtn: boolean[] = [];
    let isContractPage = true;
    let contractID: number;
    let isAllAptsDone: boolean[] = [];

    $: sortedContracts = data.contracts.slice().sort((a, b) => a.id - b.id);

    // Initialize the status and toggleBtn arrays with the current status of each contract
    $: {
        if (sortedContracts.length > 0 && status.length === 0) {
            status = sortedContracts.map(contract => contract.status);
            toggleBtn = sortedContracts.map(() => false); // Initialize all toggle states to false
        }
    }

    $: sortedApartments = data.apartments.slice().sort((a, b) => a.contractid - b.contractid);

    function toggleEdit(index: number) {
        toggleBtn[index] = !toggleBtn[index];
    }

</script>

{#if isContractPage}
<div class="text-2xl grid grid-cols-5 gap-4 p-8">
    <span class="border-b-2 border-black pb-2 col-span-1 font-bold">Contract ID</span>
    <span class="border-b-2 border-black pb-2 col-span-1 font-bold">Current</span>
    <span class="border-b-2 border-black pb-2 col-span-1 font-bold">New Status</span>
    <span class="border-b-2 border-black pb-2 col-span-1 font-bold"></span>
    <span class="border-b-2 border-black pb-2 col-span-1 font-bold"></span>
</div>
{#each sortedContracts as contract, index}
<form method="post" action="?/updateContractStatus" use:enhance={({ action }) => {
    return ({ update }) => {
        update({ reset: false });
        toggleEdit(index);
    };
}} class="text-xl grid grid-cols-5 gap-4 border-b-4 border-gray-500 py-2">
        <div class="col-span-5 grid grid-cols-5 gap-4 border-gray-500 py-2">
            <span>{contract.id}</span>
            <span>{contract.status === 'new' ? 'New' : 'In Progress'}</span>
            <select name="status" bind:value={status[index]} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" disabled={!toggleBtn[index]}>
                <option value="new">New</option>
                <option value="inprogress">In Progress</option>
                <option value="complete">Complete</option>
            </select>
            <input type="hidden" name="id" value={contract.id}>
            <input type="hidden" name="dueDate" value={contract.dueDate}>

            {#if toggleBtn[index]}
            <button type="submit" class="bg-green-500 hover:bg-green-700 text-white py-1.5 px-2 rounded focus:outline-none focus:shadow-outline">
                Save
            </button>
            <button type="button" on:click={() => toggleEdit(index)} class="bg-red-500 hover:bg-red-700 text-white py-1.5 px-2 rounded focus:outline-none focus:shadow-outline">
                Cancel
            </button>
            {:else}
            <button type="button" on:click={() => toggleEdit(index)} class="bg-blue-500 hover:bg-blue-700 text-white py-1.5 px-2 rounded focus:outline-none focus:shadow-outline">
                Edit
            </button>
            <button type="button" on:click={() => {
                isContractPage = !isContractPage
                contractID  = contract.id;
                }} class="bg-blue-500 hover:bg-blue-700 text-white py-1.5 px-2 rounded focus:outline-none focus:shadow-outline">
                Apartments
            </button>
            {/if}

        </div>
    </form>
{/each}

{:else}
<div class="text-2xl grid grid-cols-4 gap-4 p-8">
    <span class="border-b-2 border-black pb-2 col-span-1 font-bold">Contract ID</span>
    <span class="border-b-2 border-black pb-2 col-span-1 font-bold">Number</span>
    <span class="border-b-2 border-black pb-2 col-span-1 font-bold">Floor</span>
    <span class="border-b-2 border-black pb-2 col-span-1 font-bold">Floor</span>
</div>

{#each sortedApartments as apartment, index}
    {#if apartment.contractid === contractID}
        <form method="post" action="?/updateApartmentStatus" use:enhance class="text-3xl grid grid-cols-4 gap-8 border-b-4 border-gray-500 py-2">
        <div class="col-span-4 grid grid-cols-4 gap-16 border-gray-500 py-2">
            <span>{apartment.contractid}</span>
            <span>{apartment.number}</span>
            <span>{apartment.floor}</span>
            <button type="submit" class="bg-green-500 hover:bg-green-700 text-white py-1.5 px-2 rounded focus:outline-none focus:shadow-outline">
                Done
            </button>
            <input type="hidden" name="contractid" value={apartment.contractid}>
            <input type="hidden" name="number" value={apartment.number}>
            <input type="hidden" name="floor" value={apartment.floor}>
        </div>
    </form>
    {/if}
{/each}
<div class="text-2xl grid-cols-4 gap-4 p-8">
    <button type="button" on:click={() => isContractPage = !isContractPage} class="bg-gray-500 hover:bg-gray-700 text-white py-1.5 px-2 rounded focus:outline-none text-center focus:shadow-outline">
        Return
    </button>
</div>
{/if}

