<script lang="ts">
    import { enhance } from "$app/forms";

    export let data;

    let teamId = '';
    let contractId = '';
    let date = '';
    let type = '';

    $: lastId = -1;
    
    const workType = ["installFrame" , "installContents"]
</script>

<form class="items-center" method="post" action="?/updateSchedule" use:enhance={({action}) => {
    return ({update}) =>{update({reset: false})
        };
    }}>

    <div class="grid grid-cols-1 gap-10 p-5">

        <div>
            <label for="teamId" class="font-bold text-lg">Team ID</label>
            <select required name="teamId" bind:value={teamId} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                {#each data.team as team}
                <option value={team.id}>{team.id}</option>
                {/each}
            </select>
        </div>

        <div>  
            <label for="contractId" class="font-bold text-lg block ">Contract ID</label>
            <select required name="contractId" bind:value={contractId} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                {#each data.apartments as apartment}
                    {#if lastId != apartment.contractid}    
                    <option value={apartment.contractid}>{apartment.contractid}</option>
                        {#await Promise.resolve() then}
                            {lastId = apartment.contractid}
                        {/await}
                    {/if}
                {/each}
        </div>

        <div>
            <label for="date" class="font-bold text-lg block">Date</label>
            <input required name="date" type="date" bind:value={date} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
        </div>

        <div>
            <label for="type" class="font-bold text-lg border-b-2">Type</label>
            <select required name="type" bind:value={type} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <option value={"installFrame"}>Install Frame</option>
                <option value={"installContents"}>Install Contents</option>
            </select>
        </div>

        <div>
            <span class="font-bold text-lg border-b-2">Description</span>
            <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="description" name="description" rows="4" cols="25"></textarea>
        </div>

        <button type="submit" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" disabled={false}>Create Schedule</button>
    </div>
</form>