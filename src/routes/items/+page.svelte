<script lang="ts">
    import ItemEditor from "./ItemEditor.svelte";

    export let data;

    let adding = false;
</script>

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
