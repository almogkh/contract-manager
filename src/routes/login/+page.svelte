<script>
    import { enhance } from "$app/forms";

    export let form;
</script>

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
