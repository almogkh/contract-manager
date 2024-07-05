<script lang="ts">
	import { enhance } from "$app/forms";

    export let data;
    export let form;
    const user = data.user!;
</script>

<span class="text-red-600 text-wrap w-4/6 mb-2 min-h-12">{form?.errorMessage ?? ''}</span>

<div class="flex flex-col gap-y-2 items-start">
    <form method="post" use:enhance={() => {
        return ({update}) => update({reset: false});
    }}>
        <div class="flex gap-2">
            <span>Team name:</span>
            <input type="text" name="teamName" value={data.team.name} required />
            <input type="hidden" name="id" value={data.team.id} />
            <button class="border border-black bg-slate-500 text-white p-1" formaction="?/editTeam">Update team</button>
            <button class="border border-black rounded-md bg-red-600 text-white p-1" formaction="?/deleteTeam">Delete</button>
        </div>
    </form>
    <span>Team leader: {user.firstName} {user.lastName}</span>
    <h1 class="text-lg border-t border-black w-full underline">Team Schedule:</h1>
    {#each data.schedule as scheduleItem}
        <span>Address: {scheduleItem.item.address}</span>
        <span>Time: {scheduleItem.item.time.toDateString()}</span>
        <span>Work type: {scheduleItem.item.itemType === 'installFrame' ? 'Install frames' : 'Install contents'}</span>
        <span>Status: {scheduleItem.item.status}</span>
        <a href="/teams/{data.team.id}/{scheduleItem.item.id}" class="text-blue-600 underline">View apartments</a>
        <form method="post" action="?/markComplete" class="border-b border-black pb-2 w-full" use:enhance>
            <input name="id" type="hidden" value={scheduleItem.item.id} />
            <button class="border border-black rounded-md p-2 bg-slate-500 hover:bg-slate-700 active:bg-slate-900
                         text-white">Mark as complete</button>
        </form>
    {/each}
</div>
