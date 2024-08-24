<script lang="ts">
    // Import necessary functions and types
    import { enhance } from "$app/forms";
    import type { ItemProp } from "$lib/db/schema";
    import { confirmationPopup, errorPopup } from "$lib/popups";

    // Export props to receive data from the parent component.
    export let item: ItemProp | null = null; // The item data object, or null if adding a new item.
    export let adding: boolean = false; // A boolean indicating whether a new item is being added.

    // Initialize local state variables based on the item data.
    let name = item?.name ?? ''; 
    let price = item?.price ?? ''; 
    let quantity = item?.quantity ?? ''; 
    let width = item?.width ?? ''; 
    let height = item?.height ?? ''; 
    let shortages = (item?.shortages?.length ?? 0) > 0; // Check if the item has shortages.

    // Boolean state to manage whether the item is being edited.
    let editing = adding; // Set to true if adding a new item.
</script>

<!-- Form for editing or adding an item -->
<form method="post" class="contents" on:submit={() => editing = false} use:enhance={async ({action, cancel}) => {
    if (action.searchParams.has('/deleteItem')) {
        // Show a confirmation popup when attempting to delete an item.
        const submit = await confirmationPopup('Are you sure you want to delete this item?');
        if (!submit) {
            cancel(); // Cancel the action if the user declines.
            return;
        }
    }

    return ({update, result}) => {
        update({reset: false}); // Prevent form reset after submission.
        if (adding)
            adding = false; // Set adding to false if a new item was being added.

        // Show an error popup if the result indicates failure and includes an error message.
        if (result.type === 'failure' && result.data && typeof result.data.errorMessage === 'string') {
            errorPopup(result.data.errorMessage);
        }
    };
}}>
    <div class="flex w-full space-x-2">
        {#if shortages}
            <!-- Display a warning icon if the item has shortages -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 fill-yellow-600">
                <title>This item has shortages</title>
                <path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />
            </svg>
        {:else}
            <span class="min-w-5"/>
        {/if}
        <!-- Input fields for item details -->
        <input type="text" class="min-w-0" readonly={!editing} name="name" required bind:value={name}/>
        <input type="hidden" name="id" value={item?.id ?? ''}/>
    </div>
    <input type="text" readonly={!editing} name="quantity" required bind:value={quantity}/>
    <input type="text" readonly={!editing} name="price" required bind:value={price}/>
    <input type="text" readonly={!editing} name="width" bind:value={width}/>
    <input type="text" readonly={!editing} name="height" bind:value={height}/>

    <!-- Buttons for form actions: Edit, Delete, Save, Cancel -->
    <div class="flex gap-x-2 justify-items-center w-full">
        {#if !editing}
            <!-- Edit and Delete buttons when not editing -->
            <button type="button" class="border border-black rounded-md py-0.5 px-1 bg-slate-500 flex-1" on:click={() => editing = true}>
                Edit
            </button>
            <button formaction="?/deleteItem" formnovalidate class="border border-black rounded-md py-0.5 px-1 bg-red-600 flex-1">
                Delete
            </button>
        {:else}
            <!-- Save and Cancel buttons when editing -->
            <button formaction="?/editItem" class="border border-black rounded-md py-0.5 px-1 bg-slate-500 flex-1">
                Save
            </button>
            <button type="button" class="border border-black rounded-md py-0.5 px-1 bg-slate-500 flex-1" on:click={() => {
                if (adding) {
                    adding = false; // Cancel adding a new item.
                } else {
                    editing = false; // Cancel editing and revert changes.
                    name = item?.name ?? '';
                    price = item?.price ?? '';
                    quantity = item?.quantity ?? '';
                    width = item?.width ?? '';
                    height = item?.height ?? '';
                }
            }}>
                Cancel
            </button>
        {/if}
    </div>
</form>
