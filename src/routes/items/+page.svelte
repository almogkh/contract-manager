<script lang="ts">
    // Import the ItemEditor component for editing and adding items.
    import ItemEditor from "./ItemEditor.svelte";

    // Export the 'data' prop to receive items data from the parent component.
    export let data;

    // Boolean state to manage whether a new item is being added.
    let adding = false;
</script>

<!-- Main container for the item management interface -->
<div class="flex flex-col gap-y-6 w-10/12 items-center">
    <!-- Grid layout for displaying item details and actions -->
    <div class="grid grid-cols-6 gap-x-12 gap-y-2 justify-items-center">
        <!-- Column headers for item data -->
        <span>Name</span>
        <span>Quantity</span>
        <span>Price</span>
        <span>Width</span>
        <span>Height</span>
        <span>Actions</span>
        <!-- Divider line under the headers -->
        <span class="border-t border-black w-full col-span-6"/>
        
        <!-- Loop through each item in the data and render an ItemEditor for each -->
        {#each data.items as item}
            <ItemEditor item={item}/>
        {/each}
        
        <!-- Conditionally render an ItemEditor for adding a new item if 'adding' is true -->
        {#if adding}
            <ItemEditor bind:adding/>
        {/if}
    </div>
    
    <!-- Button to add a new item; shown only when not in 'adding' mode -->
    {#if !adding}
        <button class="border border-black p-2 bg-slate-500 rounded-md self-start ml-6" on:click={() => adding = true}>
            Add item
        </button>
    {/if}
</div>
