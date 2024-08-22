<script lang="ts">
	import { onMount } from "svelte";
	import { helpText } from "$lib/popups";


    let contentDiv: HTMLDivElement;
    onMount(() => {
        $helpText = contentDiv.innerText;

        return () => {
            $helpText = '';
        };
    });
</script>

<div bind:this={contentDiv} class="hidden">
    <slot/>
</div>
