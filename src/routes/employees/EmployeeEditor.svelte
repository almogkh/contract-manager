<script>
    import { enhance } from "$app/forms";

    export let employee;

    let readonly = true;
    let firstName = employee.firstName;
    let lastName = employee.lastName;
    let role = employee.role;
    let phoneNumber = employee.phoneNumber;
    let password = "";
</script>

<form class="contents" method="post" action="?/editEmployee" on:submit={() => readonly = true} use:enhance={() => {
    return ({update}) => update({reset: false});
}}>
    <input {readonly} name="firstName" type="text" bind:value={firstName}/>
    <input {readonly} name="lastName" type="text" bind:value={lastName}/>
    <div class="contents">
        <select disabled={readonly} bind:value={role}>
            <option value="ceo">CEO</option>
            <option value="secretary">Secretary</option>
            <option value="invmanager">Inventory manager</option>
            <option value="teamlead">Team leader</option>
        </select>
        <input type="hidden" name="role" bind:value={role}/>
    </div>
    <input {readonly} name="password" type="text" bind:value={password}/>
    <input {readonly} name="phoneNumber" type="tel" bind:value={phoneNumber}/>
    <div>
        <input type="hidden" name="id" value={employee.id}/>
        <div class="flex gap-1">
            {#if !readonly}
                <button name="submission" value="save" class="border rounded-md p-1 flex-1 bg-slate-200">Save</button>
                <button type="button" class="border rounded-md p-1 flex-1 bg-slate-200" on:click={() => {
                        readonly = true;
                        firstName = employee.firstName;
                        lastName = employee.lastName;
                        role = employee.role;
                        phoneNumber = employee.phoneNumber;
                        password = "";
                    }}>Cancel</button>
            {:else}
                <button type="button" class="border rounded-md p-1 flex-1 bg-slate-200" on:click={() => {readonly = false}}>Edit</button>
                <button name="submission" value="delete" class="border rounded-md p-1 flex-1 bg-red-600">Delete</button>
            {/if}
        </div>
    </div>
</form>
