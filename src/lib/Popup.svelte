<script lang="ts">
    import { displayPopup } from "./popups";

    export let message: string;
    export let type: string;
</script>

<div class="w-screen h-screen absolute z-50 flex flex-col place-content-center items-center bg-black/30">
    <div class="flex flex-col items-center gap-6 bg-white px-10 py-6 rounded-xl">
        {#if type === 'error'}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-12 stroke-red-600 mb-[-1.5rem]">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
        {/if}
        <span class="whitespace-pre-wrap text-center">{message}</span>

        {#if type !== 'confirm'}
            <button type="button" class="border border-black rounded-md py-1 px-8 bg-slate-400" on:click={() => {
                $displayPopup.display = false;
            }}>
                OK
            </button>

        {:else}
            <div class="flex justify-evenly space-x-6">
                <button type="button" class="border border-black rounded-md py-1 px-8 bg-slate-400" on:click={() => {
                    if ($displayPopup.cb) {
                        $displayPopup.cb(true);
                    }
                    $displayPopup.display = false;
                }}>
                    Yes
                </button>
                <button type="button" class="border border-black rounded-md py-1 px-8 bg-slate-400" on:click={() => {
                    if ($displayPopup.cb) {
                        $displayPopup.cb(false);
                    }
                    $displayPopup.display = false;
                }}>
                    No
                </button>
            </div>
        {/if}
    </div>
</div>
