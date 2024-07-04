<script>
   import CreateContract from './CreateContract.svelte';
  
    let success = false;
    
    const handleSuccess = () => {
      alert('Contract was created successefully.');
      success = true;
    };
    
    const handleError = () => {
      alert('Failed to create contract.');
    };
    </script>
  
  <h1 class="text-2xl mb-6">Create Contract</h1>
  
  {#if success}
    <p>Contract created successfully!</p>
  {/if}
  
  <CreateContract on:success={handleSuccess} on:error={handleError} />
  
  