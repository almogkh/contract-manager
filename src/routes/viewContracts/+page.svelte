<script lang="ts">
    import  {enhance} from "$app/forms";

    export let data;
    
    let sortBy = '';
    const options = ['ID', 'Address', 'Signing Data', 'Due Date', 'Price', 'Status', 'Type']

    function getContractValues(contract: any) {
        return Object.values(contract);
    }

</script>

<form method="post" action="?/" use:enhance>
    <div class="font-bold py-4 px-4 sm:px-6 lg:px-40 rounded-lg bg-white shadow-md focus:outline-none focus:shadow-outline">
        <label for="sort" class="block mb-2 text-gray-700">Sort By:</label>
        <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <select name="sort" bind:value={sortBy} class="block w-full bg-gray-100 border border-gray-300 rounded py-2 px-3 leading-tight focus:outline-none focus:bg-white focus:border-blue-500">
                {#each options as option}
                    <option value={option.toLowerCase().trim()} class="text-gray-700">{option}</option>
                {/each}
            </select>
            <button type="submit" disabled={false} class="mt-4 sm:mt-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline">
                Submit
            </button>
        </div>
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
            {#each data.contracts as contract}
            <tr>
                {#each getContractValues(contract) as value}
                <td class="py-2 px-4 border-b">{value}</td>
                {/each}
            </tr>
            {/each}
        </tbody>
    </table>
</div>

