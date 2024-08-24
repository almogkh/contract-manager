<script>
    // Import the enhance function from SvelteKit for progressive enhancement of form actions.
    import { enhance } from "$app/forms";
	import Help from "$lib/Help.svelte";

    // Export the 'form' prop to receive any form-related data, like error messages, from the parent component or server.
    export let form;
</script>

<Help>
This is the login page. You must be logged in to use the system.
Please enter the username and password the CEO provided you and then press 'Log in'.

Note that your username is firstname.lastname.
</Help>

<!-- Login form setup -->
<form method="post" action="?/login" class="flex flex-col items-center space-y-4" use:enhance>
    <!-- Username input field -->
    <label>
        Username:
        <input name="username" type="text" required>
    </label>

    <!-- Password input field -->
    <label>
        Password:
        <input name="password" type="password" required>
    </label>

    <!-- Submit button for the login form -->
    <button class="border rounded-md bg-gray-600 p-2">Log in</button>
</form>

<!-- Error message display -->
{#if form?.error}
    <span class="text-red-600 mt-4">{form.error}</span>
{/if}
