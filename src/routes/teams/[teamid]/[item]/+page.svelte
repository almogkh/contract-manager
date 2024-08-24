<script lang="ts">
    // Import the enhance function from SvelteKit for progressive enhancement of form actions.
    import { enhance } from "$app/forms";
    // Import the page store to access route parameters and reactive page data.
    import { page } from "$app/stores";

    // Export the 'data' prop to receive schedule data from the parent component or server.
    export let data;
    // Find the specific schedule item based on the item ID from the URL parameters.
    let schedItem = data.schedule.find((item) => item.item.id === parseInt($page.params.item))!;
</script>

<!-- Loop through each apartment in the selected schedule item and render its details -->
{#each schedItem.apartments as apartment}
<div class="border border-black p-2 flex flex-col gap-y-4 w-full">
    <!-- Display basic apartment information -->
    <span>Floor: {apartment.floor}</span>
    <span>Number: {apartment.number}</span>
    <span>Status: {apartment.status === 'pending' ? 'Pending' : 'Complete'}</span>

    <!-- Conditionally display window dimensions if available -->
    {#if apartment.windowWidth && apartment.windowHeight}
        <span>Window width: {apartment.windowWidth}</span>
        <span>Window height: {apartment.windowHeight}</span>
    {/if}

    <!-- Conditionally display door dimensions if available -->
    {#if apartment.doorWidth && apartment.doorHeight}
        <span>Door width: {apartment.doorWidth}</span>
        <span>Door height: {apartment.doorHeight}</span>
    {/if}

    <!-- Divider line -->
    <span class="border-t border-black mx-[-0.5rem]"/>
    
    <!-- Header for the items section -->
    <h1 class="text-lg underline">Items:</h1>
    
    <!-- Grid layout for displaying items associated with the apartment -->
    <div class="grid grid-cols-4 gap-x-4 justify-items-center">
        <!-- Column headers for item data -->
        <span>Name</span>
        <span>Quantity</span>
        <span>Width</span>
        <span>Height</span>
        <!-- Divider line under the headers -->
        <span class="border-t border-black col-span-4 w-full"/>
        
        <!-- Loop through each item in the apartment and display its details -->
        {#each apartment.items as item}
            <span class="text-xs sm:text-base">{item.name}</span>
            <span class="text-xs sm:text-base">{item.quantity}</span>
            <span class="text-xs sm:text-base">{item.width ? item.width : ''}</span>
            <span class="text-xs sm:text-base">{item.height ? item.height : ''}</span>
        {/each}
    </div>

    <!-- Form for marking the apartment as complete -->
    <form method="post" action="?/markComplete" class="border-t border-black mx-[-0.5rem] pt-2" use:enhance>
        <!-- Hidden inputs to send the apartment details to the server -->
        <input type="hidden" name="contractid" value={apartment.contractid} />
        <input type="hidden" name="floor" value={apartment.floor} />
        <input type="hidden" name="number" value={apartment.number} />
        
        <!-- Button to submit the form and mark the apartment as complete -->
        <button class="border border-black rounded-md p-2 ml-2 bg-slate-500 hover:bg-slate-700 active:bg-slate-900 text-white">Mark as complete</button>
    </form>
</div>
{/each}
