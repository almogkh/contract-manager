<script lang="ts">
	import Help from "$lib/Help.svelte";
    import ItemEditor from "./ItemEditor.svelte";

    export let data;

    let adding = false;
</script>

<Help>
On this page you can manage the company's inventory.

You can edit an existing item by pressing the 'Edit' button on the right. After you made some changes you
can save the changes by pressing 'Save'. You can also cancel the changes by pressing 'Cancel'.

Alternatively, you can completely delete an item by pressing 'Delete'.

You can also add a new item by pressing 'Add item'.

Items that have a yellow mark next to them are items that are needed for a contract but there is a shortage of that item.
</Help>

<div class="flex flex-col gap-y-6 w-10/12 items-center">
<div class="grid grid-cols-6 gap-x-12 gap-y-2 justify-items-center">
    <span>Name</span>
    <span>Quantity</span>
    <span>Price</span>
    <span>Width</span>
    <span>Height</span>
    <span>Actions</span>
    <span class="border-t border-black w-full col-span-6"/>
    {#each data.items as item}
        <ItemEditor item={item}/>
    {/each}
    {#if adding}
        <ItemEditor bind:adding/>
    {/if}
</div>
{#if !adding}
    <button class="border border-black p-2 bg-slate-500 rounded-md self-start ml-6" on:click={() => adding = true}>
        Add item
    </button>
{/if}
</div>
