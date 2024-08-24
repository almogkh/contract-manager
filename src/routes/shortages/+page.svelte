<script lang="ts">
    // Import the enhance function from SvelteKit for progressive enhancement of form actions.
    import { enhance } from "$app/forms";
	import Help from "$lib/Help.svelte";

    // Export the 'data' prop to receive shortages data from the parent component or server.
    export let data;
</script>

<Help>
On this page you can manage item shortages that are needed for contracts.

This page will list the current shortages, the amount missing, the item's price and the contract's due date.
You should ensure the items are ordered and that they arrive before the due date.

Once you've ordered an item, you can mark it as ordered by clicking 'Mark as ordered'.
When the item arrives, you can mark the shortage as complete by clicking 'Mark as complete'.
</Help>

<!-- Main container for the shortages list -->
<div class="grid grid-cols-7 gap-2">
    <!-- Column headers for shortages data -->
    <span>Name</span>
    <span>Price</span>
    <span>Amount</span>
    <span>Width</span>
    <span>Height</span>
    <span>Due date</span>
    <span>Status</span>
    <!-- Divider line under the headers -->
    <span class="border-t border-black col-span-7"/>

    <!-- Loop through each shortage in the data and render its details -->
    {#each data.shortages as shortage}
        <span>{shortage.item.name}</span>
        <span>{shortage.item.price}</span>
        <span>{shortage.amount}</span>
        <span>{shortage.item.width ?? 'N/A'}</span>
        <span>{shortage.item.height ?? 'N/A'}</span>
        <span>{shortage.dueDate}</span>

        <!-- Display current status and provide a form to update the status -->
        <div class="flex gap-2">
            <!-- Show the current status of the shortage -->
            {shortage.status === 'pending' ? 'Pending' : 'Ordered'}
            
            <!-- Form for updating the shortage status -->
            <form method="post" action="?/updateShortage" use:enhance>
                <!-- Hidden inputs to send the shortage ID and status -->
                <input type="hidden" name="status" value={shortage.status}/>
                <input type="hidden" name="id" value={shortage.id}/>
                
                <!-- Button to submit the form and update the status -->
                <button class="border border-black rounded-md p-1 bg-slate-500">
                    Mark as {shortage.status === 'pending' ? 'ordered' : 'complete'}
                </button>
            </form>
        </div>
    {/each}
</div>
