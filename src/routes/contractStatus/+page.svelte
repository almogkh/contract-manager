<script lang="ts">
    import { enhance } from "$app/forms";

    export let data;
</script>

<div class="grid grid-cols-4 gap-4 p-8">
    <span class="font-bold text-lg border-b-2 border-black pb-2 col-span-1">ID</span>
    <span class="font-bold text-lg border-b-2 border-black pb-2 col-span-1">Floor</span>
    <span class="font-bold text-lg border-b-2 border-black pb-2 col-span-1">Number</span>
    <span class="font-bold text-lg border-b-2 border-black pb-2 col-span-1">Status</span>
    
    {#each data.apartmentsList as apt}
        <div class="col-span-4 grid grid-cols-4 gap-4 border-b-4 border-gray-500 py-2">
            <span class="col-span-1">{apt.contractid}</span>
            <span class="col-span-1">{apt.floor}</span>
            <span class="col-span-1">{apt.number}</span>
            
            <form method="post" action="?/updateStatus" use:enhance class="col-span-1 flex justify-center items-center">
                <input type="hidden" name="id" value={apt.contractid}>
                <input type="hidden" name="floor" value={apt.floor}>
                <input type="hidden" name="number" value={apt.number}>
                <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-1.5 px-2 rounded focus:outline-none focus:shadow-outline">
                    Done
                </button>
            </form>
        </div>
    {/each}
</div>
