<script lang="ts">
    import { enhance } from "$app/forms";
    import { page } from "$app/stores";
    import Popup from "$lib/Popup.svelte";
    import { displayPopup } from "$lib/popups";
    import "../app.css";

    export let data;
    
    function returnPath(path: string) {
        const res = path.substring(0, path.lastIndexOf('/'));
        return res === '' ? '/' : res;
    }
</script>

<div class="bg-slate-300 min-h-screen flex flex-col items-center pb-8">
    <header class="flex justify-end w-full p-2 border-b mb-4">
        <form method="post" action="/login?/logout" use:enhance>
            <button class="{data.user ? "" : "invisible"} p-1 mr-2 border rounded-md bg-red-600 text-white">Logout</button>
        </form>
    </header>

    {#if $page.url.pathname !== '/'}
        <a class="border p-2 bg-slate-400 text-center self-start ml-6 mb-6 min-w-32 flex space-x-4 justify-center"
            href={returnPath($page.url.pathname)}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>

            <span>Back</span>
        </a>
    {/if}

    <main class="flex flex-col items-center px-2 max-w-full">
        <slot />
    </main>

    {#if $displayPopup.display}
        <Popup message={$displayPopup.message} type={$displayPopup.type}/>
    {/if}
</div>
