<script lang="ts">
    import  {enhance} from "$app/forms";

    export let data;
    
    let sortBy = '';

    let options = ['ID', 'Address', 'Signing Data', 'Due Date', 'Price', 'Status', 'Type']

</script>

<form method="post" action="?/" use:enhance>
    <div class="font-bold py-4 px-4 sm:px-6 lg:px-40 rounded-lg bg-white shadow-md focus:outline-none focus:shadow-outline">
        <label for="sort" class="block mb-2 text-gray-700">Sort By:</label>
        <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <select name="sort" bind:value={sortBy} class="block w-full bg-gray-100 border border-gray-300 rounded py-2 px-3 leading-tight focus:outline-none focus:bg-white focus:border-blue-500">
                {#each options as option}
                    <option value={option} class="text-gray-700">{option}</option>
                {/each}
            </select>
            <button class="mt-4 sm:mt-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline">
                Submit
            </button>
        </div>
    </div>
</form>


<div class="contracts-list mt-4 overflow-x-auto">
    <table class="min-w-full bg-white">
        <thead>
            <tr>
                <th class="text-left py-2 px-4 border-b">ID</th>
                <th class="text-left py-2 px-4 border-b">Address</th>
                <th class="text-left py-2 px-4 border-b">Signing Date</th>
                <th class="text-left py-2 px-4 border-b">Due Date</th>
                <th class="text-left py-2 px-4 border-b">Price</th>
                <th class="text-left py-2 px-4 border-b">Status</th>
                <th class="text-left py-2 px-4 border-b">Type</th>
            </tr>
        </thead>
        <tbody>
            {#each data.contracts as contract}
            <tr>
                <td class="py-2 px-4 border-b">{contract.id}</td>
                <td class="py-2 px-4 border-b">{contract.address}</td>
                <td class="py-2 px-4 border-b">{contract.signingDate}</td>
                <td class="py-2 px-4 border-b">{contract.dueDate}</td>
                <td class="py-2 px-4 border-b">{contract.price}</td>
                <td class="py-2 px-4 border-b">{contract.status}</td>
                <td class="py-2 px-4 border-b">{contract.type}</td>
            </tr>
            {/each}
        </tbody>
    </table>
</div>

