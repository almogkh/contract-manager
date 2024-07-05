<script lang="ts">
	import { enhance } from "$app/forms";
    import { page } from "$app/stores";

    export let data;
    let schedItem = data.schedule.find((item) => item.item.id === parseInt($page.params.item))!;
</script>

{#each schedItem.apartments as apartment}
<div class="border border-black p-2 flex flex-col gap-y-4 w-full">
    <span>Floor: {apartment.floor}</span>
    <span>Number: {apartment.number}</span>
    <span>Status: {apartment.status === 'pending' ? 'Pending': 'Complete'}</span>
    {#if apartment.windowWidth && apartment.windowHeight}
        <span>Window width: {apartment.windowWidth}</span>
        <span>Window height: {apartment.windowHeight}</span>
    {/if}
    {#if apartment.doorWidth && apartment.doorHeight}
        <span>Door width: {apartment.doorWidth}</span>
        <span>Door height: {apartment.doorHeight}</span>
    {/if}

    <span class="border-t border-black mx-[-0.5rem]"/>
    <h1 class="text-lg underline">Items:</h1>
    <div class="grid grid-cols-4 gap-x-4 justify-items-center">
        <span>Name</span>
        <span>Quantity</span>
        <span>Width</span>
        <span>Height</span>
        <span class="border-t border-black col-span-4 w-full"/>
    {#each apartment.items as item}
        <span class="text-xs sm:text-base">{item.name}</span>
        <span class="text-xs sm:text-base">{item.quantity}</span>
        <span class="text-xs sm:text-base">{item.width ? item.width : ''}</span>
        <span class="text-xs sm:text-base">{item.height ? item.height : ''}</span>
    {/each}
    </div>

    <form method="post" action="?/markComplete" class="border-t border-black mx-[-0.5rem] pt-2" use:enhance>
        <input type="hidden" name="contractid" value={apartment.contractid} />
        <input type="hidden" name="floor" value={apartment.floor} />
        <input type="hidden" name="number" value={apartment.number} />
        <button class="border border-black rounded-md p-2 ml-2 bg-slate-500 hover:bg-slate-700 active:bg-slate-900
                         text-white">Mark as complete</button>
    </form>
</div>
{/each}
