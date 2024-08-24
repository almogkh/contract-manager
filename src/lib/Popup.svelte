<script lang="ts">
    // Importing the displayPopup store from the popups module
    import { displayPopup } from "./popups";

    // The component accepts two props: message and type
    export let message: string;
    export let type: string;
</script>

<!-- Main container for the popup, positioned absolutely to cover the entire screen -->
<div class="w-screen h-screen overflow-hidden fixed z-50 flex flex-col place-content-center items-center bg-black/30">
    <!-- Inner container for the popup content, centered on the screen -->
    <div class="flex flex-col items-center gap-6 bg-white px-10 py-6 rounded-xl">
        <!-- Conditionally render an error icon if the type is 'error' -->
        {#if type === 'error'}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-12 stroke-red-600 mb-[-1.5rem]">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
        {/if}
        <!-- Display the message passed into the component -->
        <span class="whitespace-pre-wrap {type !== 'help' ? 'text-center' : ''}">{message}</span>

        <!-- If the popup type is not 'confirm', show a single 'OK' button -->
        {#if type !== 'confirm'}
            <button type="button" class="border border-black rounded-md py-1 px-8 bg-slate-400" on:click={() => {
                $displayPopup.display = false; // Close the popup when 'OK' is clicked
            }}>
                OK
            </button>

        <!-- Otherwise, display 'Yes' and 'No' buttons for confirmation -->
        {:else}
            <div class="flex justify-evenly space-x-6">
                <button type="button" class="border border-black rounded-md py-1 px-8 bg-slate-400" on:click={() => {
                    if ($displayPopup.cb) { // If a callback is provided, call it with 'true'
                        $displayPopup.cb(true);
                    }
                    $displayPopup.display = false; // Close the popup
                }}>
                    Yes
                </button>
                <button type="button" class="border border-black rounded-md py-1 px-8 bg-slate-400" on:click={() => {
                    if ($displayPopup.cb) { // If a callback is provided, call it with 'false'
                        $displayPopup.cb(false);
                    }
                    $displayPopup.display = false; // Close the popup
                }}>
                    No
                </button>
            </div>
        {/if}
    </div>
</div>
