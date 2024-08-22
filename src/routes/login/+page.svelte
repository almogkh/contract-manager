<script>
    import { enhance } from "$app/forms";
	import Help from "$lib/Help.svelte";

    export let form;
</script>

<Help>
This is the login page. You must be logged in to use the system.
Please enter the username and password the CEO provided you and then press 'Log in'.

Note that your username is firstname.lastname.
</Help>

<form method="post" action="?/login" class="flex flex-col items-center space-y-4" use:enhance>
    <label>
        Username:
        <input name="username" type="text" required>
    </label>
    <label>
        Password:
        <input name="password" type="password" required>
    </label>
    <button class="border rounded-md bg-gray-600 p-2">Log in</button>
</form>

{#if form?.error}
<span class="text-red-600 mt-4">{form.error}</span>
{/if}
