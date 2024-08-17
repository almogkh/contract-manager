<script lang="ts">
    import { enhance } from "$app/forms";

    export let data;
</script>

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
