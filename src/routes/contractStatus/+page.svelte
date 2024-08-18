<script lang="ts">
    import { enhance } from "$app/forms";

    export let data;

    // Define the type of the status array as an array of strings
    let status: string[] = [];
    let toggleBtn: boolean[] = [];

    $: sortedContracts = data.contracts.slice().sort((a, b) => a.id - b.id);

    // Initialize the status and toggleBtn arrays with the current status of each contract
    $: {
        if (sortedContracts.length > 0 && status.length === 0) {
            status = sortedContracts.map(contract => contract.status);
            toggleBtn = sortedContracts.map(() => false); // Initialize all toggle states to false
        }
    }

    function toggleEdit(index: number) {
        toggleBtn[index] = !toggleBtn[index];
    }

</script>

<div class="text-2xl grid grid-cols-4 gap-4 p-8">
    <span class="border-b-2 border-black pb-2 col-span-1 font-bold">Contract ID</span>
    <span class="border-b-2 border-black pb-2 col-span-1 font-bold">Current Status</span>
    <span class="pb-2 col-span-1 font-bold"></span>
    <span class="pb-2 col-span-1 font-bold"></span>
</div>

<div class="text-xl grid grid-cols-3 gap-4">
{#each sortedContracts as contract, index}
<form method="post" action="?/updateContractStatus" use:enhance class="contents">
    <div class="col-span-3 grid grid-cols-3 gap-4 border-gray-500 py-2">
        <span>{contract.id}</span>
        <span>{contract.status === 'new' ? 'New' : 'In Progress'}</span>

        <button class="bg-blue-500 hover:bg-blue-700 text-white py-1.5 px-2 rounded focus:outline-none focus:shadow-outline">
            {#if contract.status === 'new'}
                Mark as In Progress
            {:else}
                Mark as Complete
            {/if}
        </button>
        <input type="hidden" name="status" value={contract.status === 'new' ? 'inprogress' : 'complete'}/>
        <input type="hidden" name="id" value={contract.id}/>
        <input type="hidden" name="dueDate" value={contract.dueDate}/>
    </div>
</form>
<span class="col-span-3 border-b-4 border-gray-500"/>
{/each}
</div>
