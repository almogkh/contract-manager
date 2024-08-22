<script lang="ts">
    import { enhance } from "$app/forms";
	import Help from "$lib/Help.svelte";

    export let data;
</script>

<Help>
On this page you can manage item shortages that are needed for contracts.

This page will list the current shortages, the amount missing, the item's price and the contract's due date.
You should ensure the items are ordered and that they arrive before the due date.

Once you've ordered an item, you can mark it as ordered by clicking 'Mark as ordered'.
When the item arrives, you can mark the shortage as complete by clicking 'Mark as complete'.
</Help>

<div class="grid grid-cols-7 gap-2">
    <span>Name</span>
    <span>Price</span>
    <span>Amount</span>
    <span>Width</span>
    <span>Height</span>
    <span>Due date</span>
    <span>Status</span>
    <span class="border-t border-black col-span-7"/>
{#each data.shortages as shortage}
    <span>{shortage.item.name}</span>
    <span>{shortage.item.price}</span>
    <span>{shortage.amount}</span>
    <span>{shortage.item.width ?? 'N/A'}</span>
    <span>{shortage.item.height ?? 'N/A'}</span>
    <span>{shortage.dueDate}</span>
    <div class="flex gap-2">
        {shortage.status === 'pending' ? 'Pending' : 'Ordered'}
        <form method="post" action="?/updateShortage" use:enhance>
            <input type="hidden" name="status" value={shortage.status}/>
            <input type="hidden" name="id" value={shortage.id}/>
            <button class="border border-black rounded-md p-1 bg-slate-500">
                Mark as {shortage.status === 'pending' ? 'ordered' : 'complete'}
            </button>
        </form>
    </div>
{/each}
</div>
