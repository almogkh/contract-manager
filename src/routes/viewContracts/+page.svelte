<script lang="ts">
    import { enhance } from "$app/forms";

    export let data;

    let filters = {
        id: '',
        signingDate: '',
        dueDate: '',
        status: '',
        type: ''
    };

    let filteredContracts = data.contracts;

    let showDueDates = -1;

    const options = ['ID', 'Address', 'Signing Date', 'Due Date', 'Price', 'Status', 'Type', 'Floor Due Dates'];

    function filterListBy() {
        filteredContracts = data.contracts.filter(contract => {
            return (!filters.id || contract.id.toString().includes(filters.id)) &&
                   (!filters.signingDate || contract.signingDate.includes(filters.signingDate)) &&
                   (!filters.dueDate || contract.dueDate.includes(filters.dueDate)) &&
                   (!filters.status || contract.status === filters.status) &&
                   (!filters.type || contract.type === filters.type);
        });
    }

    function resetFilter(){
        filters = {
        id: '',
        signingDate: '',
        dueDate: '',
        status: '',
        type: ''
    };
    }
    
    function getContractValues(contract: typeof data.contracts[number]) {
        const {floorDueDates, ...rest} = contract;
        return Object.values(rest);
    }
</script>

<form method="post" action="?/filterList" use:enhance>
    <div class="filters p-4 mb-4">

        <div class="mb-4 bm-16 text-2xl">
            <label for="id" class="block text-gray-700 font-bold">ID:</label>
            <input type="text" id="id" bind:value={filters.id} class="w-full border rounded px-2 py-1 "/>
        </div>
        
        <div class="mb-4 bm-16 text-2xl">
            <label for="signingDate" class="block text-gray-700 font-bold">Signing Date:</label>
            <input type="date" id="signingDate" bind:value={filters.signingDate} class="w-full border rounded px-2 py-1"/>
        </div>
        
        <div class="mb-4 bm-16 text-2xl">
            <label for="dueDate" class="block text-gray-700 font-bold ">Due Date:</label>
            <input type="date" id="dueDate" bind:value={filters.dueDate} class="w-full border rounded px-2 py-1"/>
        </div>

        <div class="mb-4 bm-16 text-2xl">
            <label for="status" class="block text-gray-700 font-bold">Status:</label>
            <select name="contractStatus" bind:value={filters.status} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <option value="">Any</option>
                <option value="new">New</option>
                <option value="inprogress">In Progress</option>
                <option value="complete">Complete</option>
            </select>
        </div>

        <div class="mb-4 bm-16 text-2xl">
            <label for="type" class="block text-gray-700 font-bold">Type:</label>
            <select name="contractType" bind:value={filters.type} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <option value="">Any</option>
                <option value="newContract">New Contract</option>
                <option value="repairedContract">Repaired Contract</option>
            </select>
        </div>

        <button type="button" on:click={filterListBy} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Apply Filters
        </button>
        <button type="button" on:click={() => {
            resetFilter();
            filterListBy();
        }} class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            clear
        </button>

    </div>
</form>

<div class="contracts-list mt-4 overflow-x-auto">
    <table class="min-w-full bg-white rounded text-xl">
        <thead>
            <tr>
                {#each options as option}
                <th class="text-left py-2 px-4 border-b">{option}</th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each filteredContracts as contract, idx}
            <tr>
                {#each getContractValues(contract) as value}
                <td class="py-2 px-4 border-b">{value}</td>
                {/each}
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

{#if showDueDates !== -1}
<div class="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-40">
  <div class="bg-white p-8 rounded shadow-md max-w-md mx-auto mt-20">
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
    <button type="button" on:click={() => {
        showDueDates = -1;
      }}
      class="block mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
      Done
    </button>
  </div>
</div>
{/if}
