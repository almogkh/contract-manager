<script>
	import { enhance } from "$app/forms";
</script>

<form method="post" action="?/login" class="flex flex-col items-center space-y-4" use:enhance>
    <label>
		Username:
		<input name="username" type="text">
	</label>
	<label>
		Password:
		<input name="password" type="password">
	</label>
	<button class="border rounded-md bg-gray-600 p-2">Log in</button>
</form>
