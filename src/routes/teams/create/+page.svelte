<script>
	import { enhance } from "$app/forms";


</script>


<form method="post" action="?/createTeam" class="flex flex-col gap-y-4 w-screen items-center" use:enhance>
    <div class="grid grid-cols-2 gap-y-4">
        <span class="justify-self-center">Team name:</span>
        <input type="text" name="teamName" required/>
    </div>
    <button class="border border-black rounded-md p-2 bg-slate-600 text-white">Create team</button>
</form>
