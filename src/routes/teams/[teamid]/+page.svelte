<script lang="ts">
    import { enhance } from "$app/forms";
	import Help from "$lib/Help.svelte";
	import { confirmationPopup, popup } from "$lib/popups";

    // Props to receive data and form state from the parent component or server.
    export let data;
    export let form;

    // Extract the current user and team installers from the data prop.
    const user = data.user!;
    let installers = data.team.installers;
    let disableButtons = false;
</script>

<Help>
Here you can edit your team, view your team's schedule and mark scheduled tasks as complete.

You can change the team's name, or change the list of installers that are members of this team.
Clicking the red X will delete the installer from the list. You can click on 'Add installer' to add a new
installer to the list. For each installer you can specify their name.

Once you've finished editing the team, you can click on 'Update team'.

You can delete the team by clicking on 'Delete team'. If the team has work assigned to it, you will need to move the work
to a different team or to finish the job before you can delete the team.

At the bottom of the page you can view your team's schedule.
For each schedule item, you can click on 'View apartments' to see the apartments that your team needs to take care of.
</Help>

<!-- Display error message if form submission fails -->
<span class="text-red-600 text-wrap w-4/6 mb-2 min-h-12">{form?.errorMessage ?? ''}</span>

<div class="flex flex-col gap-y-2 items-start">
    <!-- Form to edit or delete a team -->
    <form method="post" use:enhance={async ({action, cancel}) => {
        // Confirmation for deleting a team
        if (action.searchParams.has('/deleteTeam')) {
            const submit = await confirmationPopup('Are you sure you want to delete this team?');
            if (!submit) {
                cancel();
                return;
            }
        }

        disableButtons = true;
        return async ({update, result}) => {
            update({reset: false});
            if (result.type === 'success') {
                popup('Team successfully updated.')
            }

            disableButtons = false;
        }
    }} class="flex flex-col gap-4">
        
        <!-- Team name input -->
        <div class="flex gap-2">
            <span>Team name:</span>
            <input type="text" name="teamName" value={data.team.name} required readonly={disableButtons} />
            <input type="hidden" name="id" value={data.team.id} />
        </div>

        <!-- Display team leader -->
        <span>Team leader: {user.firstName} {user.lastName}</span>

        <!-- Display and edit installers list -->
        <span>Installers:</span>
        {#each installers as installer, i}
        <div class="flex gap-x-2">
            <!-- Button to remove an installer -->
            <button type="button" on:click={() => installers = installers.toSpliced(i, 1)} disabled={disableButtons}>
                <!-- SVG icon for delete button -->
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 stroke-red-600 fill-red-600">
                    <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                </svg>
            </button>
            <span class="justify-self-center">Installer name</span>
            <!-- Installer name input -->
            <input type="text" name="installer" bind:value={installer} required readonly={disableButtons}/>
        </div>
        {/each}

        <!-- Button to add a new installer -->
        <button type="button" class="border border-black rounded-md py-0.5 px-1.5 w-fit bg-slate-600 text-white" on:click={() => {
            installers.push('');
            installers = installers;
        }} disabled={disableButtons}>Add installer</button>
        <!-- Buttons to update or delete the team -->
        <button class="border border-black bg-slate-500 text-white p-1" formaction="?/editTeam" disabled={disableButtons}>Update team</button>
        <button class="border border-black rounded-md bg-red-600 text-white p-1" formaction="?/deleteTeam" formnovalidate disabled={disableButtons}>
            Delete team
        </button>
    </form>

    <!-- Display team schedule -->
    <h1 class="text-lg border-t border-black w-full underline">Team Schedule:</h1>
    {#each data.schedule as scheduleItem}
        <span>Address: {scheduleItem.item.address}</span>
        <span>Time: {scheduleItem.item.date}</span>
        <span>Work type: {scheduleItem.item.itemType === 'installFrame' ? 'Install frames' : 'Install contents'}</span>
        <a href="/teams/{data.team.id}/{scheduleItem.item.id}" class="text-blue-600 underline">View apartments</a>
        <span class="w-full border-b border-black"/>
    {/each}
</div>
