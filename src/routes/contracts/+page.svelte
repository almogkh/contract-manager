<script lang="ts">
  // Import the enhance function for progressive enhancement of forms in SvelteKit.
  import { enhance } from "$app/forms";

  // Export props received from parent component or page.
  export let data;
  export let form;

  // Define variables to hold form input values and component states.
  let address = '';
  let signingDate = '';
  let price = '';
  let dueDate = '';
  let contractType = 'newContract';
  let contractStatus = 'pending';

  // Define types for items, apartments, and due dates.
  type ItemsInApt = {
    id: string;
    name: string;
    width: string;
    height: string;
  }
  
  type Apartment = {
    floor: string;
    number: string;
    aptItems: ItemsInApt[];
    isAddItem: boolean;
    aptStatus: string;
  }

  type DueDates = {
    floor: number,
    dueDate: string,
  }

  // Define state variables for a new apartment, apartments array, and floor due dates array.
  let newApartment: Apartment = {
    floor: '',
    number: '',
    aptItems: [],
    isAddItem: false,
    aptStatus: 'pending'
  };

  let apartments: Apartment[] = [];
  let floorDueDates: DueDates[] = [];

  // State variables to control the visibility of modals and editing states.
  let showAddApartment = false;
  let showEditApartment = false;
  let showDueDates = false;
  let ApartmentToEditIndex: number = 0;

  // Variables for item selection and addition status.
  let selectedItem: string | null = null;
  let additionStatus: string | null = null;

  // Flags for checking the presence of door and window items in an apartment.
  let hasDoor = false;
  let hasWindow = false;

  // Form reference for floor due dates.
  let floorForm: HTMLFormElement;

  // Reactive statement to control the submission button state based on the apartments array.
  $: canSubmit = apartments.length > 0;

  /**
   * Adds or edits an apartment in the apartments array.
   * @param index - Index of the apartment to edit; -1 if adding a new apartment.
   */
  const addApartment = (index: number) => {
      if (!newApartment.floor || !newApartment.number || !newApartment.aptStatus || !newApartment.aptItems.length) {
          alert('Please fill in all required fields');
          return;
      }

      if (index !== -1) {
          apartments[index] = { ...newApartment };
      } else {
          apartments = [...apartments, { ...newApartment }];
      }

      // Reset newApartment and related states after adding or editing.
      newApartment = {
          floor: '',
          number: '',
          aptItems: [],
          isAddItem: false,
          aptStatus: 'pending'
      };

      hasDoor = false;
      hasWindow = false;

      // Close the appropriate modal.
      if (index !== -1)
          showEditApartment = false;
      else 
          showAddApartment = false;
  };

  /**
   * Removes an apartment from the apartments array.
   * @param index - Index of the apartment to remove.
   */
  const removeApartment = (index: number) => {
      apartments = apartments.filter((_, i) => i !== index);
  };

  /**
   * Edits an existing apartment by setting it as the current newApartment.
   * @param index - Index of the apartment to edit.
   */
  function editApartment(index: number) {
      ApartmentToEditIndex = index;
      newApartment = { ...apartments[index] };
      showEditApartment = true;

      // Set flags for existing items in the apartment.
      hasDoor = newApartment.aptItems.some(item => item.name.toLowerCase() === "door");
      hasWindow = newApartment.aptItems.some(item => item.name.toLowerCase() === "window");
  }

  /**
   * Removes an item from the newApartment's items list.
   * @param itemId - ID of the item to remove.
   */
  function removeItemFromApartment(itemId: string) {
    const item = newApartment.aptItems.find(item => item.id === itemId);
    if (item) {
        if (item.name.toLowerCase() === "door") hasDoor = false;
        if (item.name.toLowerCase() === "window") hasWindow = false;
    }
    newApartment.aptItems = newApartment.aptItems.filter(item => item.id !== itemId);
  }

  /**
   * Adds an item to the newApartment's items list.
   */
  function addItem() {
    const selectedItemData = data.items.find(item => item.id.toString() === selectedItem);
    if (selectedItemData && selectedItemData.height != null && selectedItemData.width != null) {
      if (selectedItemData.name.toLowerCase() === "door" && hasDoor) {
        additionStatus = "Only one Door can be added.";
        return;
      }
      if (selectedItemData.name.toLowerCase() === "window" && hasWindow) {
        additionStatus = "Only one Window can be added.";
        return;
      }
      newApartment.aptItems = [
        ...newApartment.aptItems,
        {
          id: selectedItemData.id.toString(), // Convert id to string
          name: selectedItemData.name,
          width: selectedItemData.width.toString(),
          height: selectedItemData.height.toString()
        }
      ];
      if (selectedItemData.name.toLowerCase() === "door") hasDoor = true;
      if (selectedItemData.name.toLowerCase() === "window") hasWindow = true;
    } else {
      additionStatus = "Failed to add item to the apartment.";
    }
  }
</script>

<h1 class="text-2xl mb-6">Create contract</h1>

<!-- Form for creating a contract -->
<form method="post" action="?/createContract" use:enhance
  class="w-full max-w-lg mx-auto mt-8">

  <!-- Address Input -->
  <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2">
          Address: <span style="color:red;">*</span>
          <input name="address" type="text" bind:value={address} required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </label>
  </div>

  <!-- Signing Date Input -->
  <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2">
          Signing Date: <span style="color:red;">*</span>
          <input name="signingDate" type="date" bind:value={signingDate} required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </label>
  </div>

  <!-- Price Input -->
  <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2">
          Price: <span style="color:red;">*</span>
          <input name="price" type="number" step="0.01" min="0" bind:value={price} required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </label>
  </div>

  <!-- Due Date Input -->
  <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2">
          Due Date: <span style="color:red;">*</span>
          <input name="dueDate" type="date" bind:value={dueDate} required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </label>
      <button type="button" on:click={() => showDueDates = true} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Edit floor due dates</button>
  </div>

  <!-- Contract Type Select -->
  <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2">
          Contract Type: <span style="color:red;">*</span>
          <select name="contractType" bind:value={contractType} required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option value="newContract">New Contract</option>
              <option value="repairedContract">Repaired Contract</option>
          </select>
      </label>
  </div>

  <!-- Button to Add Apartment -->
  <div class="mb-4">
      <button type="button" on:click={() => showAddApartment = true} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Add Apartment</button>
  </div>

  <!-- Submit Button -->
  <button type="submit" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" disabled={!canSubmit} >Create Contract</button>
  <br><br>

  <!-- List of Apartments -->
  <h2 class="text-xl mb-4">Apartments</h2>
  {#each apartments as apartment, index}
  <div class="mb-4 border-b-2 pb-4">
      <p><strong>Apartment {index + 1}:</strong></p>
      <p><strong>Floor:</strong> {apartment.floor}</p>
      <p><strong>Apartment Number:</strong> {apartment.number}</p>
      {#each apartment.aptItems as item}
        <p><strong>{item.name}: </strong> {item.width}W x {item.height}H</p>
      {/each}
      <p><strong>Status:</strong> {apartment.aptStatus}</p>
      <button type="button" on:click={() => editApartment(index)} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Edit</button>
      <button type="button" on:click={() => removeApartment(index)} class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Remove</button>
  </div>
  {/each}

  <!-- Button to Clear All Apartments -->
  <div class="mb-4">
      <button type="button" on:click={() => apartments = []} class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Clear All Apartments</button>
  </div>

  <!-- Hidden Input to Store Apartments -->
  <input type="hidden" name="apartments" value={JSON.stringify(apartments)} />
  {#each floorDueDates as dueDate}
    <input type="hidden" name="dueDateFloor" value={dueDate.floor} />
    <input type="hidden" name="dueDateDate" value={dueDate.dueDate} />
  {/each}
</form>

{#if showDueDates}
<div class="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-40">
  <div class="bg-white p-8 rounded shadow-md max-w-md mx-auto mt-20">
    <form bind:this={floorForm}>
    {#each floorDueDates as _, idx}
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">
          Floor: <span style="color:red;">*</span>
          <input type="number" bind:value={floorDueDates[idx].floor} required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        </label>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">
          Due date: <span style="color:red;">*</span>
          <input type="date" bind:value={floorDueDates[idx].dueDate} required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        </label>
      </div>
      <div class="mb-4">
        <button type="button" on:click={() => floorDueDates = floorDueDates.toSpliced(idx, 1)} class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Remove floor
        </button>
      </div>
    {/each}
    </form>
    <button type="button" on:click={() => {floorDueDates.push({floor: NaN, dueDate: ''}); floorDueDates = floorDueDates;}} class="block mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Add floor</button>
    <button type="button" on:click={() => {
        if (floorForm.reportValidity())
          showDueDates = false;
      }}
      class="block mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
      Done
    </button>
  </div>
</div>
{/if}

<!-- Add Apartment Modal -->
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
              <input type="checkbox" bind:checked={newApartment.isAddItem}>
              Add Item
          </label>
          
          {#if newApartment.isAddItem}
            <select bind:value={selectedItem}
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4">
              {#each data.items as item}
                <option value={item.id.toString()}>{item.name}: {item.width}W x {item.height}H</option>
              {/each}
            </select>
            <button type="button" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
              on:click={addItem}>
              Add Item
            </button>
            {#if additionStatus}
              <p class="mt-2 text-red-500">{additionStatus}</p>
            {/if}
          {/if}

          <h3 class="font-bold text-2xl mt-4">Added Items</h3>
          <ul>
            {#each newApartment.aptItems as item}
              <li class="flex justify-between items-center border-b py-2">
                <span>{item.name}: {item.width}W x {item.height}H</span>
                <button type="button" on:click={() => removeItemFromApartment(item.id)} class="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">
                  Delete
                </button>
              </li>
            {/each}
          </ul>
      </div>
      <div class="flex justify-between">
          <button type="button" on:click={() => showAddApartment = false} class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Cancel</button>
          <button type="button" on:click={() => addApartment(-1)} class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Add Apartment</button>
      </div>
  </div>
</div>
{/if}

<!-- Edit Apartment Modal -->
{#if showEditApartment}
<div class="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-40">
  <div class="bg-white p-8 rounded shadow-md max-w-md mx-auto mt-20">
      <h2 class="text-2xl mb-4">Edit Apartment</h2>
      <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">
              Apartment Floor: <span style="color:red;">*</span>
              <input type="number" placeholder="Enter floor" bind:value={newApartment.floor} required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </label>
      </div>
      <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">
              Apartment Number: <span style="color:red;">*</span>
              <input type="number" step="1" placeholder="Enter apartment number" bind:value={newApartment.number} required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </label>
      </div>
      <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">
              <input type="checkbox" bind:checked={newApartment.isAddItem}>
              Add Item
          </label>

          {#if newApartment.isAddItem}
          <select bind:value={selectedItem}
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            {#each data.items as item}
              <option value={item.id.toString()}>{item.name}: {item.width}W x {item.height}H</option>
            {/each}
          </select>
          <button type="button" class="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
            on:click={addItem}>
            Add Item
          </button>
          {/if}
        

        <h3 class="font-bold text-2xl mt-4">Added Items</h3>
        <ul>
          {#each newApartment.aptItems as item}
            <li class="flex justify-between items-center border-b py-2">
              <span>{item.name}: {item.width}W x {item.height}H</span>
              <button type="button" on:click={() => removeItemFromApartment(item.id)} class="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">
                Delete
              </button>
            </li>
          {/each}
        </ul>
      </div>
      <div class="flex justify-between">
          <button type="button" on:click={() => showEditApartment = false} class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Cancel</button>
          <button type="button" on:click={() => addApartment(ApartmentToEditIndex)} class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Save Apartment</button>
      </div>
  </div>
</div>
{/if}

{#if form?.success}
  <script>
    alert("Contract created successfully");
  </script>
{/if}
