<script lang="ts">
    import { enhance } from "$app/forms";

    export let data;

    let teamlead = '';
    let address = '';
    let date = '';
    let type = '';
</script>

<form class="items-center" method="post" action="?/updateSchedule" use:enhance={({action}) => {
    return ({update}) =>{update({reset: false})
        };
    }}>

    <div class="grid grid-cols-4 gap-20 p-10">
        <span class="font-bold text-lg border-b-2 border-black pb-2 col-span-1">Teamlead</span>
        <span class="font-bold text-lg border-b-2 border-black pb-2 col-span-1">Address</span>
        <span class="font-bold text-lg border-b-2 border-black pb-2 col-span-1">Date</span>
        <span class="font-bold text-lg border-b-2 border-black pb-2 col-span-1">Type</span>
    </div>
        
    <div class="grid grid-cols-4 gap-4 border-b-4 border-gray-500 py-2">
        
        <select name="teamlead" bind:value={teamlead} required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            {#each data.teamleads as lead}
            <option value={lead.name}>{lead.name}</option>
            {/each}
        </select>
        <input required name="address" type="text" bind:value={address}/>
        <input required name="date" type="date" bind:value={date}/>
        <input required name="type" type="text" bind:value={type}/>
    </div>
</form>