<script lang="ts">
    import { enhance } from "$app/forms";

    export let data;
    export let form;

    let teamId = '';
    let contractId = '';
    let scheduleid = '';
    let date = '';
    let type = '';
    let description = '';
    
    $: lastId = -1;

    const workType = ["installFrame", "installContents"]

    let showTeamInfo = false;
    let isEdit = false;
    
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth' 
        });
    }

    function exitEditView(){
        contractId = '';
        date = '';
        type = '';
        description = '';
        isEdit = false;
    }
</script>

<style>
    /* Break line in description*/
    .description-wrapper {
      max-width: 20ch;
      white-space: normal;
      overflow-wrap: break-word;
      word-wrap: break-word;
    }
</style>

<form class="items-center" method="post" action={ isEdit ? "?/updateSchedule" : "?/addSchedule" } 
use:enhance={() =>{
    return async ({update}) => {
        await update(); 
        exitEditView();
        };
    }}>
    <div class="text-xl grid grid-cols-1 gap-10 p-5">
        <div class="flex items-center space-x-8">
            <label for="teamId" class="font-bold ">Choose Team</label> 
            <select name="teamId" bind:value={teamId} on:click={() =>  showTeamInfo = false} class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                {#each data.team as team}
                <option value={team.id.toString()}>{team.id}, {team.name}</option>
                {/each}
            </select>

            <button type="button" on:click={() => {
                if(teamId != '') 
                    showTeamInfo = true;
                exitEditView();
            }} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border-t-2 border-gray-500">
                Get Schedule
            </button>
        </div>

        {#if showTeamInfo}
            {#if isEdit}
            <span class="font-bold text-4xl block "> Schedule ID: {scheduleid}</span> 
            {/if}
            <div>  
                <label for="contractId" class="font-bold text-lg block ">Contract ID: <span style="color:red;"> *</span></label> 
                <select required name="contractId" bind:value={contractId} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    {#each data.contracts as contracts}
                        {#if lastId != contracts.id}  
                        <option value={contracts.id.toString()}>{contracts.id}</option>
                        {/if}
                    {/each}
                </select>
            </div>    
            <div>
                <label for="type" class="font-bold text-lg border-b-2">Type: <span style="color:red;"> *</span></label> 
                <select required name="type" bind:value={type} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <option value={"installFrame"}>Install Frame</option>
                    <option value={"installContents"}>Install Contents</option>
                </select>
            </div>
            <div>
                <label for="date" class="font-bold text-lg block">Date: <span style="color:red;"> *</span></label> 
                <input required name="date" type="date" bind:value={date} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
            </div>
        <div>
            <span class="font-bold text-lg border-b-2">Description:</span>
            <textarea bind:value={description} name="description" rows="4" cols="25" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
        </div>
            {#if !isEdit}
            <button type="submit" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" disabled={false}>
                Add New Schedule
            </button>
            {:else}
            <button formaction="?/updateSchedule" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" disabled={false}>
                Save Changes
            </button>
            <button type="button" on:click={() => exitEditView()} class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" disabled={false}>
                Cancel Edit
            </button>
            {/if}
        {/if}
    </div>

    <input type="hidden" name="scheduleid" value={scheduleid} />
</form>

{#if showTeamInfo}
    {#each data.schedules as schedule, index}
        {#if schedule.teamid == parseInt(teamId)}
        <div class="text-xl border-b-8 pb-2 border-gray-400">
            <p><strong>Team ID:</strong> {schedule.teamid}</p>
            <p><strong>Schedule ID:</strong> {schedule.id}</p>
            <p><strong>Contract ID:</strong> {schedule.contractid}</p>
            <p><strong>Execution Date:</strong> {schedule.date}</p>
            <p><strong>Type:</strong> {schedule.itemType}</p>
            
            {#if schedule.description != ''}
            <div class="description-wrapper">
                <strong>Description:</strong>
                <p>{schedule.description}</p>
            </div>
            {/if}

            <form method="post" action="?/updateSchedule" use:enhance>
                <button type="button" on:click={() => {
                    scheduleid = schedule.id.toString();
                    teamId = schedule.teamid.toString();
                    contractId = schedule.contractid != null ? schedule.contractid.toString() : '';
                    date = schedule.date;
                    type = schedule.itemType;
                    description = schedule.description != null ? schedule.description : '';
                    isEdit = true;
                    scrollToTop();

                }} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Edit
                </button>

                <button formaction="?/deleteSchedule" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Delete
                </button>
                <input type="hidden" name="contractid" value={schedule.contractid} />
                <input type="hidden" name="scheduleid" value={schedule.id} />
            </form>
        </div>
        {/if}
    {/each}
{/if}



{#if form?.success}
<script>
    alert("Schedule Saved Successfully");
</script>
{/if}
