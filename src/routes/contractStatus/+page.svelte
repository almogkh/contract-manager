<script lang="ts">
    // Import the enhance function for enhancing form actions in SvelteKit.
    import { enhance } from "$app/forms";
	import Help from "$lib/Help.svelte";
	import { confirmationPopup } from "$lib/popups";

    // Export the 'data' prop to receive contracts data from the parent component.
    export let data;

    // Define arrays to manage the status and toggle states for each contract.
    let status: string[] = [];
    let toggleBtn: boolean[] = [];

    // Reactive declaration to sort contracts by ID.
    $: sortedContracts = data.contracts.slice().sort((a, b) => a.id - b.id);

    // Initialize the status and toggleBtn arrays with the current status of each contract.
    // Ensures arrays are initialized only once when contracts are loaded.
    $: {
        if (sortedContracts.length > 0 && status.length === 0) {
            status = sortedContracts.map(contract => contract.status); // Initialize status with contract statuses.
            toggleBtn = sortedContracts.map(() => false); // Initialize all toggle states to false.
        }
    }

    /**
     * Toggles the edit mode for a specific contract.
     * @param index - The index of the contract to toggle.
     */
    function toggleEdit(index: number) {
        toggleBtn[index] = !toggleBtn[index]; // Toggles the button state for the specified index.
    }

</script>

<Help>
Here you can change the status of a contract.
Simply click the 'Mark as &lbrace;status&rbrace;' to change the contract status to 'status'.

You can see details about a contract from the 'View contracts' menu.
</Help>

<!-- Layout for displaying contract data and allowing status updates -->
<div class="text-2xl grid grid-cols-4 gap-4 p-8">
    <!-- Headers for the contract list -->
    <span class="border-b-2 border-black pb-2 col-span-1 font-bold">Contract ID</span>
    <span class="border-b-2 border-black pb-2 col-span-1 font-bold">Current Status</span>
    <span class="pb-2 col-span-1 font-bold"></span>
    <span class="pb-2 col-span-1 font-bold"></span>
</div>

<div class="text-xl grid grid-cols-3 gap-4">
{#each sortedContracts as contract, index}
<!-- Form for each contract to update its status -->
<form method="post" action="?/updateContractStatus" class="contents" use:enhance={async ({cancel}) => {
    const submit = await confirmationPopup('Are you sure you want to change the contract status?');
    if (!submit) {
        cancel();
        return;
    }
}}>
    <div class="col-span-3 grid grid-cols-3 gap-4 border-gray-500 py-2">
        <!-- Display contract ID and current status -->
        <span>{contract.id}</span>
        <span>{contract.status === 'new' ? 'New' : 'In Progress'}</span>

            <!-- Button to change contract status -->
            <button class="bg-blue-500 hover:bg-blue-700 text-white py-1.5 px-2 rounded focus:outline-none focus:shadow-outline">
                {#if contract.status === 'new'}
                    Mark as In Progress
                {:else}
                    Mark as Complete
                {/if}
            </button>

            <!-- Hidden inputs to send contract data with form submission -->
            <input type="hidden" name="status" value={contract.status === 'new' ? 'inprogress' : 'complete'}/>
            <input type="hidden" name="id" value={contract.id}/>
            <input type="hidden" name="dueDate" value={contract.dueDate}/>
        </div>
    </form>
    <!-- Divider for each contract entry -->
    <span class="col-span-3 border-b-4 border-gray-500"/>
{/each}
</div>
