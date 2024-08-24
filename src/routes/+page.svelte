<script>
	import Help from "$lib/Help.svelte";

    // Importing the 'data' prop which contains the actions the user has access to.
    export let data;
</script>

<Help>
This is the main menu where you can select all the action that you can perform.
Simply click on a button from this menu and it will take you to the screen where you can perform that action.

From any other screen, the 'Back' button will take you to the previous page.

The 'Logout' button at the top-right of the page will log you out of your account and you will have to log
back in to continue using the system.
</Help>

<div class="flex flex-col items-center space-y-4">
    {#each data.actions as action}
        <!-- Rendering each action as a link with a specific route and name -->
        <a href={action.route} class="border p-2 bg-slate-400 w-full text-center">
            {action.name}
        </a>
    {/each}
</div>
