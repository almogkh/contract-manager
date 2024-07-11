<script lang="ts">
    import { enhance } from "$app/forms";

    let address = '';
    let signingDate = '';
    let price = '';
    let dueDate = '';
    let contractType = 'newContract';
    let contractStatus = 'pending';

    let apartments: Apartment[] = [];

    let contractStatusValues = ['New', 'InProgress', 'Complete'];
    let aptStstusValues = ['Pending', 'InProgress', 'Complete'];

    let showAddApartment = false;

    let newApartment: Apartment = {
        floor: '',
        number: '',
        isWindowChecked: false,
        isDoorChecked: false,
        windowWidth: '',
        windowHeight: '',
        doorWidth: '',
        doorHeight: '',
        aptStstus: ''
    };

    $: canSubmit = apartments.length > 0;

    const addApartment = () => {

        if (!newApartment.floor ||!newApartment.number ||!newApartment.aptStstus
            || (newApartment.isWindowChecked && (newApartment.windowWidth == "" || newApartment.windowHeight == "")
            || newApartment.isDoorChecked && (newApartment.doorWidth == "" || newApartment.doorHeight == "")))
        {
            alert('Please fill in all required fields');
            return;
        }

        if (!newApartment.isWindowChecked && !newApartment.isDoorChecked)
        {
            alert('Please select at least one item to add');
            return;
        }
        
        apartments = [...apartments, { ...newApartment }];
        newApartment = {
            floor: '',
            number: '',
            isWindowChecked: false,
            isDoorChecked: false,
            windowWidth: '',
            windowHeight: '',
            doorWidth: '',
            doorHeight: '',
            aptStstus: ''
        };
        showAddApartment = false;
    };

    const removeApartment = (index: number) => {
        apartments = apartments.filter((_, i) => i !== index);
    };
</script>

<form method="post" action="?/createContract" use:enhance={() => {
    return ({ update }) => update({ reset: false });
}} class="w-full max-w-lg mx-auto mt-8">

    <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">
            Address: <span style="color:red;">*</span>
            <input name="address" type="text" bind:value={address} required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        </label>
    </div>

    <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">
            Signing Date: <span style="color:red;">*</span>
            <input name="signingDate" type="date" bind:value={signingDate} required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        </label>
    </div>

    <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">
            Price: <span style="color:red;">*</span>
            <input name="price" type="number" step="0.01" min="0" bind:value={price} required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        </label>
    </div>

    <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">
            Due Date: <span style="color:red;">*</span>
            <input name="dueDate" type="date" bind:value={dueDate} required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        </label>
    </div>

    <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">
            Contract Type: <span style="color:red;">*</span>
            <select name="contractType" bind:value={contractType} required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <option value="newContract">New Contract</option>
                <option value="repairedContract">Repaired Contract</option>
            </select>
        </label>
    </div>

    <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">
            Contract Status: <span style="color:red;">*</span>
            <select name="contractStatus" bind:value={contractStatus} required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                {#each contractStatusValues as val}
                <option value={val.toLowerCase()}>{val}</option>
                {/each}
            </select>
        </label>
    </div>

    <div class="mb-4">
        <button type="button" on:click={() => showAddApartment = true} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Add Apartment</button>
    </div>

    <button type="submit" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" disabled={!canSubmit}>Create Contract</button>
    <br><br>

    <h2 class="text-xl mb-4">Apartments</h2>
    
    {#each apartments as apartment, index}
    <div class="mb-4 border-b-2 pb-4">
        <p><strong>Apartment {index + 1}:</strong></p>
        <p><strong>Floor:<strong> {apartment.floor}</p>
            <p><strong>Apartment Number:</strong> {apartment.number}</p>
            {#if apartment.isWindowChecked}
            <p><strong>Window Size:</strong> {apartment.windowWidth}W x {apartment.windowHeight}H</p>
            {/if}
            {#if apartment.isDoorChecked}
            <p><strong>Door Size:</strong> {apartment.doorWidth}W x {apartment.doorHeight}H</p>
            {/if}
            <p><strong>Status:</strong> {apartment.aptStstus}</p>
            <button type="button" on:click={() => removeApartment(index)} class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Remove</button>
        </div>
        {/each}
        
        <div class="mb-4">
            <button type="button" on:click={() => apartments = []} class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Clear All Apartments</button>
        </div>
        <input type="hidden" name="apartments" value={JSON.stringify(apartments)} /> 
</form>

{#if showAddApartment}
<div class="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-40">
    <div class="bg-white p-8 rounded shadow-md max-w-md mx-auto mt-20">
        <h2 class="text-2xl mb-4">Add Apartment</h2>
        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">
                Apartment Floor: <span style="color:red;">*</span>
                <input type="number" bind:value={newApartment.floor} required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            </label>
        </div>
        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">
                Apartment Number: <span style="color:red;">*</span>
                <input type="number" step="1" bind:value={newApartment.number} required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            </label>
        </div>
        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">
                <input type="checkbox" bind:checked={newApartment.isWindowChecked}>
                Add Window
            </label>
            {#if newApartment.isWindowChecked}
            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">
                    Window Width: <span style="color:red;">*</span>
                    <input type="number" step="0.01" min="0" bind:value={newApartment.windowWidth} required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </label>
                <label class="block text-gray-700 text-sm font-bold mb-2">
                    Window Height: <span style="color:red;">*</span>
                    <input type="number" step="0.01" min="0" bind:value={newApartment.windowHeight} required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </label>
            </div>
            {/if}
        </div>
        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">
                <input type="checkbox" bind:checked={newApartment.isDoorChecked}>
                Add Door
            </label>
            {#if newApartment.isDoorChecked}
            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">
                    Door Width: <span style="color:red;">*</span>
                    <input type="number" step="0.01" bind:value={newApartment.doorWidth} required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </label>
                <label class="block text-gray-700 text-sm font-bold mb-2">
                    Door Height: <span style="color:red;">*</span>
                    <input type="number" step="0.01" bind:value={newApartment.doorHeight} required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </label>
            </div>
            {/if}
        </div>
        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">
                Apartment Status: <span style="color:red;">*</span>
                <select bind:value={newApartment.aptStstus} required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    {#each aptStstusValues as val}
                    <option value={val.toLowerCase()}>{val}</option>
                    {/each}
                </select>
            </label>
        </div>
        <div class="flex justify-between">
            <button type="button" on:click={() => showAddApartment = false} class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Cancel</button>
            <button type="button" on:click={addApartment} class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Add Apartment</button>
        </div>
    </div>
</div>
{/if}
