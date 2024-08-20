<script lang="ts">
    import { enhance } from "$app/forms";
	import { confirmationPopup, popup } from "$lib/popups";

    export let data;
    export let form;
    const user = data.user!;
    let installers = data.team.installers;
    let disableButtons = false;
</script>

<span class="text-red-600 text-wrap w-4/6 mb-2 min-h-12">{form?.errorMessage ?? ''}</span>

<div class="flex flex-col gap-y-2 items-start">
    <form method="post" use:enhance={async ({action, cancel}) => {
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
        <div class="flex gap-2">
            <span>Team name:</span>
            <input type="text" name="teamName" value={data.team.name} required readonly={disableButtons} />
            <input type="hidden" name="id" value={data.team.id} />
        </div>
        <span>Team leader: {user.firstName} {user.lastName}</span>
        <span>Installers:</span>
        {#each installers as installer, i}
        <div class="flex gap-x-2">
            <button type="button" on:click={() => installers = installers.toSpliced(i, 1)} disabled={disableButtons}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 stroke-red-600 fill-red-600">
                    <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                </svg>
            </button>
            <span class="justify-self-center">Installer name</span>
            <input type="text" name="installer" bind:value={installer} required readonly={disableButtons}/>
        </div>
        {/each}
        <button type="button" class="border border-black rounded-md py-0.5 px-1.5 w-fit bg-slate-600 text-white" on:click={() => {
            installers.push('');
            installers = installers;
        }} disabled={disableButtons}>Add installer</button>
        <button class="border border-black bg-slate-500 text-white p-1" formaction="?/editTeam" disabled={disableButtons}>Update team</button>
        <button class="border border-black rounded-md bg-red-600 text-white p-1" formaction="?/deleteTeam" formnovalidate disabled={disableButtons}>
            Delete
        </button>
    </form>
    <h1 class="text-lg border-t border-black w-full underline">Team Schedule:</h1>
    {#each data.schedule as scheduleItem}
        <span>Address: {scheduleItem.item.address}</span>
        <span>Time: {scheduleItem.item.date}</span>
        <span>Work type: {scheduleItem.item.itemType === 'installFrame' ? 'Install frames' : 'Install contents'}</span>
        <a href="/teams/{data.team.id}/{scheduleItem.item.id}" class="text-blue-600 underline">View apartments</a>
        <span class="w-full border-b border-black"/>
    {/each}
</div>
