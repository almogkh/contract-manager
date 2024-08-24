<script lang="ts">
    // Export the `data` prop to receive the list of teams from the parent component or server.
    export let data;
</script>

<!-- Loop through the list of teams and create a link for each team -->
{#each data.teams as team}
    <!-- Link to the team's page -->
    <a href="/teams/{team.id}" class="border p-2 bg-slate-400 w-full text-center">{team.name}</a>
{/each}

<!-- Link to the page for creating a new team -->
<a href="/teams/create" class="border-t border-black mt-4 pt-2 w-full text-blue-700 underline">Create a new team</a>
