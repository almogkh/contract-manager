<script lang="ts">
    import { enhance } from "$app/forms";
	import Help from "$lib/Help.svelte";

    // Data received from the parent component or server, containing contracts and other necessary information
    export let data;

    // Object to hold filter criteria for contracts
    let filters = {
        id: '',           // Filter by contract ID
        signingDate: '',  // Filter by signing date
        dueDate: '',      // Filter by due date
        status: '',       // Filter by contract status
        type: ''          // Filter by contract type
    };

    // Array to store contracts that match the current filter criteria
    let filteredContracts = data.contracts;

    // Index to control which contract's due dates are displayed in a modal; -1 means none are shown
    let showDueDates = -1;

    // Options for the table header representing the contract properties
    const options = ['ID', 'Address', 'Signing Date', 'Due Date', 'Price', 'Status', 'Type', 'Floor Due Dates'];

    /**
     * Filters the contracts list based on the selected filter criteria.
     * This function is triggered when the "Apply Filters" button is clicked.
     */
    function filterListBy() {
        filteredContracts = data.contracts.filter(contract => {
            return (!filters.id || contract.id.toString().includes(filters.id)) &&
                   (!filters.signingDate || contract.signingDate.includes(filters.signingDate)) &&
                   (!filters.dueDate || contract.dueDate.includes(filters.dueDate)) &&
                   (!filters.status || contract.status === filters.status) &&
                   (!filters.type || contract.type === filters.type);
        });
    }

    /**
     * Resets all filter criteria to their default empty values.
     * This function is triggered when the "Clear" button is clicked.
     */
    function resetFilter(){
        filters = {
            id: '',
            signingDate: '',
            dueDate: '',
            status: '',
            type: ''
        };
    }
    
    /**
     * Extracts all values from a contract object except for `floorDueDates`.
     * This function is used to dynamically display contract information in the table.
     * 
     * @param contract - The contract object from which values are extracted.
     * @returns An array of values from the contract object.
     */
    function getContractValues(contract: typeof data.contracts[number]) {
        const { floorDueDates, ...rest } = contract;
        return Object.values(rest);
    }
</script>

<Help>
Here you can view all the contracts in the system, both completed ones and not completed ones.

You can use the form at the top to filter the list of contracts to your liking.

At the bottom you can see the table of filtered contracts. The 'View due dates' button allows you to
see the due dates of individual floors in the contract.
</Help>

<!-- Filter Form: Allows users to filter the contract list based on various criteria -->
<form method="post" action="?/filterList" use:enhance>
    <div class="filters p-4 mb-4">

        <!-- Filter by Contract ID -->
        <div class="mb-4 bm-16 text-2xl">
            <label for="id" class="block text-gray-700 font-bold">ID:</label>
            <input type="text" id="id" bind:value={filters.id} class="w-full border rounded px-2 py-1"/>
        </div>
        
        <!-- Filter by Signing Date -->
        <div class="mb-4 bm-16 text-2xl">
            <label for="signingDate" class="block text-gray-700 font-bold">Signing Date:</label>
            <input type="date" id="signingDate" bind:value={filters.signingDate} class="w-full border rounded px-2 py-1"/>
        </div>
        
        <!-- Filter by Due Date -->
        <div class="mb-4 bm-16 text-2xl">
            <label for="dueDate" class="block text-gray-700 font-bold">Due Date:</label>
            <input type="date" id="dueDate" bind:value={filters.dueDate} class="w-full border rounded px-2 py-1"/>
        </div>

        <!-- Filter by Contract Status -->
        <div class="mb-4 bm-16 text-2xl">
            <label for="status" class="block text-gray-700 font-bold">Status:</label>
            <select name="contractStatus" bind:value={filters.status} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <option value="">Any</option>
                <option value="new">New</option>
                <option value="inprogress">In Progress</option>
                <option value="complete">Complete</option>
            </select>
        </div>

        <!-- Filter by Contract Type -->
        <div class="mb-4 bm-16 text-2xl">
            <label for="type" class="block text-gray-700 font-bold">Type:</label>
            <select name="contractType" bind:value={filters.type} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <option value="">Any</option>
                <option value="newContract">New Contract</option>
                <option value="repairedContract">Repaired Contract</option>
            </select>
        </div>

        <!-- Buttons to apply or clear filters -->
        <button type="button" on:click={filterListBy} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Apply Filters
        </button>
        <button type="button" on:click={() => {
            resetFilter();
            filterListBy();
        }} class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Clear
        </button>

    </div>
</form>

<!-- Display the filtered contracts in a table -->
<div class="contracts-list mt-4 overflow-x-auto">
    <table class="min-w-full bg-white rounded text-xl">
        <thead>
            <tr>
                <!-- Table headers based on the options array -->
                {#each options as option}
                <th class="text-left py-2 px-4 border-b">{option}</th>
                {/each}
            </tr>
        </thead>
        <tbody>
            <!-- Loop through each filtered contract and display its details -->
            {#each filteredContracts as contract, idx}
            <tr>
                <!-- Display each value of the contract except for `floorDueDates` -->
                {#each getContractValues(contract) as value}
                <td class="py-2 px-4 border-b">{value}</td>
                {/each}
                <!-- Button to show floor due dates for a specific contract -->
                <td class="py-2 px-4 border-b">
                    <button type="button" on:click={() => showDueDates = idx} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Show Due Dates
                    </button>
                </td>
            </tr>
            {/each}
        </tbody>
    </table>
</div>

<!-- Modal to display floor due dates for a selected contract -->
{#if showDueDates !== -1}
<div class="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-40">
  <div class="bg-white p-8 rounded shadow-md max-w-md mx-auto mt-20">
    <!-- Loop through each floor due date and display it -->
    {#each filteredContracts[showDueDates].floorDueDates as floorDueDate}
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">
          Floor:
          <input type="number" readonly bind:value={floorDueDate.floor} required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        </label>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">
          Due date:
          <input type="date" readonly bind:value={floorDueDate.date} required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        </label>
      </div>
    {/each}
    <!-- Button to close the modal -->
    <button type="button" on:click={() => {
        showDueDates = -1;
      }}
      class="block mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
      Done
    </button>
  </div>
</div>
{/if}
