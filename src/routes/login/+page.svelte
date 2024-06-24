<script>
	import { enhance } from "$app/forms";
</script>

<form method="post" action="?/login" class="flex flex-col items-center space-y-4" use:enhance>
    <label class="dark:text-white">
		Username:
		<input name="username" type="text" class="dark:text-black">
	</label>
	<label class="dark:text-white">
		Password:
		<input name="password" type="password" class="dark:text-black">
	</label>
	<button class="dark:text-white border rounded-md bg-gray-600 p-2">Log in</button>
</form>
