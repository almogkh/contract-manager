<script>
    import { enhance } from "$app/forms";
  
    let address = '';
    let signingDate = '';
    let price = '';
    let dueDate = '';
    let contractType = 'newContract';
    let contractStatus = 'pending';
  
    let statusValues = ['New', 'InProgress', 'Complete'];
  </script>
  
  <form method="post" action="?/createContract" use:enhance={() => {
    return ({update}) => update({reset: false});
  }} class="w-full max-w-lg mx-auto mt-8">
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2">
          Address:
        <input name="address" type="text" bind:value={address} required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </label>
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2">
          Signing Date:
        <input name="signingDate" type="date" bind:value={signingDate} required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </label>
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2">
          Price:
        <input name="price" type="number" step="0.01" bind:value={price} required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </label>
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2">
          Due Date:
        <input name="dueDate" type="date" bind:value={dueDate} required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </label>
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2">
          Contract Type:
        <select name="contractType" bind:value={contractType} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="newContract">New Contract</option>
            <option value="repairedContract">Repaired Contract</option>
        </select>
      </label>
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2">
          Contract Status:
        <select name="contractStatus" bind:value={contractStatus} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          {#each statusValues as val}
          <option value={val.toLowerCase()}>{val}</option>
          {/each}
        </select>
      </label>
    </div>
    <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Create Contract</button>
  </form>
  