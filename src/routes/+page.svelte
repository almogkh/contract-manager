<script>
    // Importing the 'data' prop which contains the actions the user has access to.
    export let data;
</script>

<div class="flex flex-col items-center space-y-4">
    {#each data.actions as action}
        <!-- Rendering each action as a link with a specific route and name -->
        <a href={action.route} class="border p-2 bg-slate-400 w-full text-center">
            {action.name}
        </a>
    {/each}
</div>
