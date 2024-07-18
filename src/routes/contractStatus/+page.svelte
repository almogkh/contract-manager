<script lang="ts"> 
    import { enhance } from "$app/forms";

    export let data;

</script>

<div class="grid grid-cols-4 gap-10">
    <span>ID</span>
    <span>Floor</span>
    <span>Number</span>
    <span>Update Status</span>
    <span class="border-t border-black col-span-4"/>

{#each data.apartmentsList as apt}
    {#if apt.status === "pending"}
        <span>{apt.contractid}</span>
        <span>{apt.floor}</span>
        <span>{apt.number}</span>
        <form method="post" action="?/updateStatus" use:enhance> 
            <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline">
                Complete
            </button>        
        </form>
        {/if}
{/each}
</div>
