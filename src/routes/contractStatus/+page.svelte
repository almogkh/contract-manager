<script lang="ts">
    import { enhance } from "$app/forms";

    export let data;

    $: sortedContracts = data.contracts.slice().sort((a, b) => a.id - b.id);

</script>

<div class="font-bold text-2xl grid grid-cols-2 gap-4 p-8">
    <span class="border-b-2 border-black pb-2 col-span-1">Contract ID</span>
    <span class="border-b-2 border-black pb-2 col-span-1">Status</span>
    
    {#each sortedContracts as contract}
        <div class="col-span-2 text-xl grid grid-cols-2 gap-4 border-b-4 border-gray-500 py-2">
            <span>{contract.id}</span>
            <form method="post" action="?/updateStatus" use:enhance class="col-span-1 flex justify-center items-center">
                <input type="hidden" name="id" value={contract.id}>
                <button class="bg-green-500 hover:bg-green-700 text-white py-1.5 px-2 rounded focus:outline-none focus:shadow-outline">
                    Done
                </button>
            </form>
        </div>
    {/each}
</div>
