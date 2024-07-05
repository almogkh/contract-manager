<script lang="ts">
	import { enhance } from "$app/forms";

    export let data;
    const user = data.user!;
</script>

<div class="flex flex-col gap-y-2 items-start">
    <span>Team name: {data.team.name}</span>
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
