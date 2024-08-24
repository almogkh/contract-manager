<script lang="ts">
    // Import the enhance function from SvelteKit for progressive enhancement of form actions
    import { enhance } from "$app/forms";
	import Help from "$lib/Help.svelte";
	import { confirmationPopup } from "$lib/popups.js";

    // Export props from parent component
    export let data;
    export let form;

    // Reactive variables to manage state
    let teamId = '';
    let contractId = '';
    let scheduleid = '';
    let date = '';
    let type = '';
    let description = '';
    let apartments: {floor: number, number: number}[] = [];
    let selectedApartment: string;
    
    // A reactive variable to manage the last selected contract ID
    $: lastId = -1;

    let showTeamInfo = false;
    let isEdit = false;
    
    // Function to smoothly scroll to the top of the page
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth' 
        });
    }

    // Function to reset the edit view and clear all input fields
    function exitEditView(){
        contractId = '';
        date = '';
        type = '';
        description = '';
        apartments = [];
        isEdit = false;
    }
</script>

<Help>
Here you can edit a team's schedule.

First select a team from the dropdown menu and click 'Get Schedule'.

Then you can fill out the form to add a new schedule item to the selected team's schedule.
After selecting the contract ID, you will be able to see the list of apartments awaiting completion in
the apartments dropdown menu below.

You can also see the existing active schedule items that the team has. You can edit these items by
clicking 'Edit' or you can delete the item by clicking 'Delete'.
</Help>

<style>
    /* Styling for the description to manage word wrapping */
    .description-wrapper {
      max-width: 20ch;
      white-space: normal;
      overflow-wrap: break-word;
      word-wrap: break-word;
    }
</style>

<!-- Form to add or edit schedule items -->
<form class="items-center" method="post" action={ isEdit ? "?/updateSchedule" : "?/addSchedule" } 
use:enhance={() =>{
    return async ({update}) => {
        await update(); 
        exitEditView();
        };
    }}>
    <!-- Form fields and controls for managing schedules -->
    <div class="text-xl grid grid-cols-1 gap-10 p-5">
        <div class="flex items-center space-x-8">
            <!-- Select dropdown to choose a team -->
            <label for="teamId" class="font-bold ">Choose Team</label> 
            <select name="teamId" bind:value={teamId} on:click={() =>  showTeamInfo = false} class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                {#each data.team as team}
                <option value={team.id.toString()}>{team.id}, {team.name}</option>
                {/each}
            </select>

            <!-- Button to display the schedule for the selected team -->
            <button type="button" on:click={() => {
                if(teamId != '') 
                    showTeamInfo = true;
                exitEditView();
            }} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border-t-2 border-gray-500">
                Get Schedule
            </button>
        </div>

        <!-- Conditional rendering to display form fields based on state -->
        {#if showTeamInfo}
            {#if isEdit}
            <span class="font-bold text-4xl block "> Schedule ID: {scheduleid}</span> 
            {/if}
            <div>  
                <!-- Select dropdown to choose a contract ID -->
                <label for="contractId" class="font-bold text-lg block ">Contract ID: <span style="color:red;"> *</span></label> 
                <select required name="contractId" bind:value={contractId} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    {#each Object.values(data.contracts) as contracts}
                        {#if lastId != contracts.id}  
                        <option value={contracts.id.toString()}>{contracts.id}</option>
                        {/if}
                    {/each}
                </select>
            </div>    
            <div>
                <!-- Select dropdown to choose the work type -->
                <label for="type" class="font-bold text-lg border-b-2">Type: <span style="color:red;"> *</span></label> 
                <select required name="type" bind:value={type} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <option value={"installFrame"}>Install Frame</option>
                    <option value={"installContents"}>Install Contents</option>
                </select>
            </div>
            <div>
                <!-- Date input to select the schedule date -->
                <label for="date" class="font-bold text-lg block">Date: <span style="color:red;"> *</span></label> 
                <input required name="date" type="date" bind:value={date} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
            </div>
        <div>
            <!-- Textarea for entering a description of the schedule -->
            <span class="font-bold text-lg border-b-2">Description:</span>
            <textarea bind:value={description} name="description" rows="4" cols="25" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
        </div>
        <div class="flex flex-col space-y-2">
            <!-- Display the list of apartments associated with the schedule -->
            <span class="font-bold text-lg border-b-2">Apartments:</span>
            {#each apartments as apartment}
                <span>Floor: {apartment.floor}</span>
                <span class="border-b border-black w-max">Number: {apartment.number}</span>
                <!-- Button to remove an apartment from the list -->
                <button type="button" class="bg-red-500 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" on:click={() => {
                    const idx = apartments.findIndex(val => val.floor === apartment.floor && val.number === apartment.number);
                    apartments = apartments.toSpliced(idx, 1);
                }}>Remove apartment</button>
                <!-- Hidden input fields to store apartment floor and number -->
                <input type="hidden" name="floor" value={apartment.floor}/>
                <input type="hidden" name="number" value={apartment.number}/>
            {/each}
            <!-- Dropdown to select an apartment to add -->
            <select bind:value={selectedApartment} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            {#if contractId !== ''}
            {#each data.contracts[parseInt(contractId)].apartments.filter(val => !apartments.find(v => v.floor === val.floor && v.number === val.number)) as apartment}
                <option value={apartment.floor + '-' + apartment.number}>Floor: {apartment.floor}, number: {apartment.number}</option>
            {/each}
            {/if}
            </select>
            <!-- Button to add the selected apartment to the schedule -->
            <button type="button" class="bg-blue-500 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" on:click={() => {
                if (!selectedApartment)
                    return;
                const [floor, number] = selectedApartment.split('-');
                apartments.push({floor: parseInt(floor), number: parseInt(number)});
                apartments = apartments;
            }}>Add apartment</button>
        </div>
            <!-- Conditional rendering for adding or editing a schedule -->
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

    <!-- Hidden input to store schedule ID -->
    <input type="hidden" name="scheduleid" value={scheduleid} />
</form>

<!-- Display the team's schedule information if selected -->
{#if showTeamInfo}
    {#each data.schedules as teamSchedule}
    {#each teamSchedule as schedule}
        {#if schedule.item.teamid == parseInt(teamId)}
        <div class="text-xl border-b-8 pb-2 border-gray-400">
            <p><strong>Team ID:</strong> {schedule.item.teamid}</p>
            <p><strong>Schedule ID:</strong> {schedule.item.id}</p>
            <p><strong>Contract ID:</strong> {schedule.item.contractid}</p>
            <p><strong>Execution Date:</strong> {schedule.item.date}</p>
            <p><strong>Type:</strong> {schedule.item.itemType}</p>
            
            {#if schedule.item.description != ''}
            <div class="description-wrapper">
                <strong>Description:</strong>
                <p>{schedule.item.description}</p>
           
            </div>
            {/if}

            <!-- Form for editing or deleting the schedule item -->
            <form method="post" action="?/updateSchedule" use:enhance={ async ({action, cancel}) => {
                if (action.searchParams.has('/deleteSchedule')) {
                   const submit = await confirmationPopup('Are you sure you want to delete this item?');
                    if (!submit) {
                        cancel();
                        return;
                    } 
                }
            }}>
                <!-- Button to enter edit mode for the selected schedule item -->
                <button type="button" on:click={() => {
                    scheduleid = schedule.item.id.toString();
                    teamId = schedule.item.teamid.toString();
                    contractId = schedule.item.contractid != null ? schedule.item.contractid.toString() : '';
                    date = schedule.item.date;
                    type = schedule.item.itemType;
                    description = schedule.item.description != null ? schedule.item.description : '';
                    apartments = [];
                    for (const item of schedule.apartments) {
                        apartments.push({floor: item.floor, number: item.number});
                    }
                    apartments = apartments;
                    isEdit = true;
                    scrollToTop();
                    
                }} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Edit
                </button>

                <!-- Button to delete the schedule item -->
                <button formaction="?/deleteSchedule" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Delete
                </button>
                <!-- Hidden inputs to store contract ID and schedule ID -->
                <input type="hidden" name="contractid" value={schedule.item.contractid} />
                <input type="hidden" name="scheduleid" value={schedule.item.id} />
            </form>
        </div>
        {/if}
    {/each}
    {/each}
{/if}

<!-- Display a success message when a schedule is successfully saved -->
{#if form?.success}
<script>
    alert("Schedule Saved Successfully");
</script>
{/if}
