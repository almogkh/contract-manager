<script>
    // Import the EmployeeEditor component for editing and adding employee data.
    import EmployeeEditor from "./EmployeeEditor.svelte";

    // Export the 'data' prop to receive employees data from the parent component.
    export let data;

    // Boolean state to manage whether a new employee is being added.
    let adding = false;
</script>

<!-- Container for the employee management interface -->
<div class="flex flex-col items-center w-screen">
    <!-- Header for the employee data management section -->
    <h1 class="text-2xl mb-6">View and edit employee data</h1>

    <!-- Main content container with a flexible width and gap between elements -->
    <div class="flex flex-col items-center w-5/6 gap-y-1">
        <!-- Grid layout for displaying employee details and actions -->
        <div class="grid grid-cols-6 w-full gap-x-2 gap-y-1">
            <!-- Column headers for employee data -->
            <span>First name</span>
            <span>Last name</span>
            <span>Role</span>
            <span>Password</span>
            <span>Phone number</span>
            <span>Actions</span>
            <!-- Divider line under the headers -->
            <span class="border-b border-black my-1 col-span-6"/>
            <!-- Loop through each employee in the data and render an EmployeeEditor for each -->
            {#each data.employees as employee}
                <EmployeeEditor employee={employee}/>
            {/each}
            <!-- Conditionally render an EmployeeEditor for adding a new employee if 'adding' is true -->
            {#if adding}
                <EmployeeEditor employee={null} bind:adding/>
            {/if}
        </div>
        <!-- Button to add a new employee; shown only when not in 'adding' mode -->
        {#if !adding}
            <button type="button" class="border border-black bg-white self-start rounded-md py-1 px-2" on:click={() => adding = true}>
                Add new employee
            </button>
        {/if}
    </div>
</div>
