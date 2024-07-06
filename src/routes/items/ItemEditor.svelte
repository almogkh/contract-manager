<script lang="ts">
    import { enhance } from "$app/forms";
    import type { ItemProp } from "$lib/db/schema";
    import { errorPopup } from "$lib/popups";

    export let item: ItemProp = null;
    export let adding: boolean = false;

    let name = item?.name ?? '';
    let price = item?.price ?? '';
    let quantity = item?.quantity ?? '';
    let width = item?.width ?? '';
    let height = item?.height ?? '';

    let editing = adding;
</script>

<form method="post" class="contents" use:enhance={() => {
    return ({update, result}) => {
        update({reset: false});
        if (adding)
            adding = false;

        if (result.type === 'failure' && result.data?.errorMessage) {
            errorPopup(result.data.errorMessage);
        }
    };
}}>
    <div class="grid grid-cols-3 gap-x-2 w-full">
        {#if item?.shortages}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 fill-yellow-600 justify-self-start">
                <title>This item has shortages</title>
                <path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />
            </svg>
        {:else}
            <span/>
        {/if}
        <span class="justify-self-center">{item?.id ?? ''}</span>
        <input type="hidden" name="id" value={item?.id ?? ''}/>
    </div>
    <input type="text" readonly={!editing} name="name" required bind:value={name}/>
    <input type="text" readonly={!editing} name="price" required bind:value={price}/>
    <input type="text" readonly={!editing} name="quantity" required bind:value={quantity}/>
    <input type="text" readonly={!editing} name="width" bind:value={width}/>
    <input type="text" readonly={!editing} name="height" bind:value={height}/>
    <div class="flex gap-x-2 justify-items-center w-full">
        {#if !editing}
            <button type="button" class="border border-black rounded-md py-0.5 px-1 bg-slate-500 flex-1" on:click={() => editing = true}>
                Edit
            </button>
            <button formaction="?/deleteItem" formnovalidate class="border border-black rounded-md py-0.5 px-1 bg-red-600 flex-1">
                Delete
            </button>
        {:else}
            <button formaction="?/editItem" class="border border-black rounded-md py-0.5 px-1 bg-slate-500 flex-1">
                Save
            </button>
            <button type="button" class="border border-black rounded-md py-0.5 px-1 bg-slate-500 flex-1" on:click={() => {
                if (adding) {
                    adding = false;
                } else {
                    editing = false;
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
