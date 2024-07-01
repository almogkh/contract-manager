<script lang="ts">
    export let data;
</script>

{#each data.teams as team}
    <a href="/teams/{team.id}" class="border p-2 bg-slate-400 w-full text-center">{team.name}</a>
{/each}
