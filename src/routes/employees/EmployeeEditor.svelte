<script>
    // Import the enhance function for progressive enhancement of form actions in SvelteKit.
    import { enhance } from "$app/forms";
	import { confirmationPopup, errorPopup } from "$lib/popups";

    // Export props to receive data from the parent component.
    export let employee; // The employee data object, or null if adding a new employee.
    export let adding = false; // A boolean indicating whether a new employee is being added.

    // Initialize local state variables based on the employee data.
    let readonly = employee !== null; // Determines if the form inputs should be read-only.
    let firstName = employee?.firstName ?? ''; // First name of the employee.
    let lastName = employee?.lastName ?? ''; // Last name of the employee.
    let role = employee?.role ?? 'secretary'; // Role of the employee, defaulting to 'secretary'.
    let phoneNumber = employee?.phoneNumber ?? ''; // Phone number of the employee.
    let userid = employee?.id ?? ''; // ID of the employee.
    let password = ""; // Password field, initially empty.
</script>

<!-- Form for editing or adding an employee -->
<form class="contents" method="post" on:submit={() => readonly = true} use:enhance={async ({action, cancel}) => {
    if (action.searchParams.has('/deleteEmployee')) {
        const submit = await confirmationPopup('Are you sure you want to delete this employee?')
        if (!submit) {
            cancel();
            return;
        }
    }

    return ({update, result}) => {
        update({reset: false}); // Prevent form reset after submission.
        if (action.searchParams.has('/addEmployee')) { // If adding a new employee, reset the adding state.
            adding = false;
        } else if (action.searchParams.has('/deleteEmployee')) {
            if (result.type === 'failure' && result.data && typeof result.data.errorMessage === 'string') {
                errorPopup(result.data.errorMessage);
            }
        }
    };
}}>
    <!-- Input fields for employee details -->
    <input {readonly} required name="firstName" type="text" bind:value={firstName}/>
    <input {readonly} required name="lastName" type="text" bind:value={lastName}/>
    
    <div class="contents">
        <!-- Role selection dropdown, disabled if in readonly mode -->
        <select disabled={readonly} required bind:value={role}>
            <option value="ceo">CEO</option>
            <option value="secretary">Secretary</option>
            <option value="invmanager">Inventory manager</option>
            <option value="teamlead">Team leader</option>
        </select>
        <!-- Hidden input to submit the role value -->
        <input type="hidden" name="role" bind:value={role}/>
    </div>
    
    <!-- Password input, required only when adding a new employee -->
    <input {readonly} required={adding} name="password" type="text" bind:value={password}/>
    
    <!-- Phone number input -->
    <input {readonly} required name="phoneNumber" type="tel" bind:value={phoneNumber}/>

    <div>
        <!-- Hidden input to submit the user ID -->
        <input type="hidden" name="id" bind:value={userid}/>
        
        <!-- Buttons for form actions: Save, Cancel, Edit, Delete -->
        <div class="flex gap-1">
            {#if !readonly}
                <!-- Save button, uses different form actions for adding or editing -->
                <button formaction={adding ? "?/addEmployee" : "?/editEmployee"} class="border rounded-md p-1 flex-1 bg-slate-200">
                    Save
                </button>
                <!-- Cancel button to reset form fields or toggle 'adding' state -->
                <button type="button" class="border rounded-md p-1 flex-1 bg-slate-200" on:click={() => {
                        if (employee) {
                            readonly = true;
                            firstName = employee.firstName;
                            lastName = employee.lastName;
                            role = employee.role;
                            phoneNumber = employee.phoneNumber;
                            password = "";
                        } else {
                            adding = false;
                        }
                    }}>Cancel</button>
            {:else}
                <!-- Edit button to toggle form to editable mode -->
                <button type="button" class="border rounded-md p-1 flex-1 bg-slate-200" on:click={() => {readonly = false}}>Edit</button>
                <!-- Delete button for removing the employee -->
                <button formaction="?/deleteEmployee" class="border rounded-md p-1 flex-1 bg-red-600">Delete</button>
            {/if}
        </div>
    </div>
</form>
