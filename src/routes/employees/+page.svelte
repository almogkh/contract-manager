<script>
    import EmployeeEditor from "./EmployeeEditor.svelte";

    export let data;

    let adding = false;
</script>

<div class="flex flex-col items-center w-screen">
    <h1 class="text-2xl mb-6">View and edit employee data</h1>

    <div class="flex flex-col items-center w-5/6 gap-y-1">
        <div class="grid grid-cols-6 w-full gap-x-2 gap-y-1">
            <span>First name</span>
            <span>Last name</span>
            <span>Role</span>
            <span>Password</span>
            <span>Phone number</span>
            <span>Actions</span>
            <span class="border-b border-black my-1 col-span-6"/>
            {#each data.employees as employee}
                <EmployeeEditor employee={employee}/>
            {/each}
            {#if adding}
                <EmployeeEditor employee={null} bind:adding/>
            {/if}
        </div>
        {#if !adding}
            <button type="button" class="border border-black bg-white self-start rounded-md py-1 px-2" on:click={() => adding = true}>
                Add new employee
            </button>
        {/if}
    </div>

</div>
