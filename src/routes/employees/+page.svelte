<script>
	import EmployeeEditor from "./EmployeeEditor.svelte";

    export let data;

    let editing = false;
</script>

<div class="flex flex-col items-center w-screen">
    <h1 class="text-2xl mb-6">View and edit employee data</h1>

    <div class="grid grid-cols-6 w-5/6 gap-x-2 gap-y-1">
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
    </div>
</div>
