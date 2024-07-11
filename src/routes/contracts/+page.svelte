<script>
   import CreateContract from './CreateContract.svelte';
   export let form;
</script>

<h1 class="text-2xl mb-6">Create contract</h1>
  
{#if form?.success}
  <script>
    alert("Contract created successfully");
  </script>
{/if}
  
<CreateContract />
  