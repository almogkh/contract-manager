<script lang="ts">
    // Import the enhance function from SvelteKit for progressive enhancement of form actions.
    import { enhance } from "$app/forms";

    // Define an array to hold the list of installers.
    let installers: string[] = [];
</script>

<!-- Form for creating a new team -->
<form method="post" action="?/createTeam" class="flex flex-col gap-y-4 w-screen items-center" use:enhance>
    <!-- Container for the form inputs arranged in a grid -->
    <div class="grid grid-cols-2 gap-y-4">
        <!-- Input for the team name -->
        <span class="justify-self-center">Team name:</span>
        <input type="text" name="teamName" required/>
        
        <!-- Loop through the installers array to display input fields for each installer -->
        {#each installers as installer, i}
            <div class="flex gap-x-2">
                <!-- Button to remove an installer from the list -->
                <button type="button" on:click={() => installers = installers.toSpliced(i, 1)}>
                    <!-- SVG icon for delete button -->
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 stroke-red-600 fill-red-600">
                        <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                    </svg>
                </button>
                <span class="justify-self-center">Installer name</span>
            </div>
            <!-- Input for the installer name, bound to the installer variable -->
            <input type="text" name="installer" bind:value={installer} required/>
        {/each}
    </div>

    <!-- Button to add a new installer to the list -->
    <button type="button" class="border border-black rounded-md p-2 bg-slate-600 text-white" on:click={() => {
        installers.push('');
        installers = installers;
    }}>Add installer</button>

    <!-- Submit button to create the team -->
    <button class="border border-black rounded-md p-2 bg-slate-600 text-white">Create team</button>
</form>
