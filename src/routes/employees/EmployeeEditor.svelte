<script>
    import { enhance } from "$app/forms";
	import { confirmationPopup, errorPopup } from "$lib/popups";

    export let employee;
    export let adding = false;

    let readonly = employee !== null;
    let firstName = employee?.firstName ?? '';
    let lastName = employee?.lastName ?? '';
    let role = employee?.role ?? 'secretary';
    let phoneNumber = employee?.phoneNumber ?? '';
    let userid = employee?.id ?? '';
    let password = "";
</script>

<form class="contents" method="post" on:submit={() => readonly = true} use:enhance={async ({action, cancel}) => {
    if (action.searchParams.has('/deleteEmployee')) {
        const submit = await confirmationPopup('Are you sure you want to delete this employee?')
        if (!submit) {
            cancel();
            return;
        }
    }

    return ({update, result}) => {
        update({reset: false});
        if (action.searchParams.has('/addEmployee')) {
            adding = false;
        } else if (action.searchParams.has('/deleteEmployee')) {
            if (result.type === 'failure' && result.data && typeof result.data.errorMessage === 'string') {
                errorPopup(result.data.errorMessage);
            }
        }
    };
}}>
    <input {readonly} required name="firstName" type="text" bind:value={firstName}/>
    <input {readonly} required name="lastName" type="text" bind:value={lastName}/>
    <div class="contents">
        <select disabled={readonly} required bind:value={role}>
            <option value="ceo">CEO</option>
            <option value="secretary">Secretary</option>
            <option value="invmanager">Inventory manager</option>
            <option value="teamlead">Team leader</option>
        </select>
        <input type="hidden" name="role" bind:value={role}/>
    </div>
    <input {readonly} required={adding} name="password" type="text" bind:value={password}/>
    <input {readonly} required name="phoneNumber" type="tel" bind:value={phoneNumber}/>
    <div>
        <input type="hidden" name="id" bind:value={userid}/>
        <div class="flex gap-1">
            {#if !readonly}
                <button formaction={adding ? "?/addEmployee" : "?/editEmployee"} class="border rounded-md p-1 flex-1 bg-slate-200">
                    Save
                </button>
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
                <button type="button" class="border rounded-md p-1 flex-1 bg-slate-200" on:click={() => {readonly = false}}>Edit</button>
                <button formaction="?/deleteEmployee" class="border rounded-md p-1 flex-1 bg-red-600">Delete</button>
            {/if}
        </div>
    </div>
</form>
