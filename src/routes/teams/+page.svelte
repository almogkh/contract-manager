<script lang="ts">
	import Help from "$lib/Help.svelte";

    export let data;
</script>

<Help>
Here you can manage all the teams that you lead.

You can click on one of you existing teams from the list to view the team page
or you can create a new team that you'll lead by clicking on 'Create a new team'.
</Help>

{#each data.teams as team}
    <a href="/teams/{team.id}" class="border p-2 bg-slate-400 w-full text-center">{team.name}</a>
{/each}

<a href="/teams/create" class="border-t border-black mt-4 pt-2 w-full text-blue-700 underline">Create a new team</a>
