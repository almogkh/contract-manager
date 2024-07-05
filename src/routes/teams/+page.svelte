<script lang="ts">
    export let data;
</script>

{#each data.teams as team}
    <a href="/teams/{team.id}" class="border p-2 bg-slate-400 w-full text-center">{team.name}</a>
{/each}

<a href="/teams/create" class="border-t border-black mt-4 pt-2 w-full text-blue-700 underline">Create a new team</a>
