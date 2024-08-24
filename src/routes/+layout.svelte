<script lang="ts">
    import { enhance } from "$app/forms";
    import { page } from "$app/stores";
    import Popup from "$lib/Popup.svelte";
    import { displayPopup } from "$lib/popups";
    import "../app.css";

    // Data provided to the component, typically user information or other relevant data.
    export let data;
    
    /**
     * Returns the parent path of the given URL path.
     * 
     * This function extracts the parent directory of the provided URL path.
     * If the path does not contain any slashes (i.e., it's a root path), it returns '/'.
     *
     * @param {string} path - The URL path to process.
     * @returns {string} The parent path.
     */
    function returnPath(path: string) {
        const res = path.substring(0, path.lastIndexOf('/'));
        return res === '' ? '/' : res;
    }

</script>

<div class="bg-slate-300 min-h-screen flex flex-col items-center pb-8">
    <!-- Header with a logout button -->
    <header class="flex justify-end w-full p-2 border-b mb-4">
        <!-- Logout form with visibility based on user authentication status -->
        <form method="post" action="/login?/logout" use:enhance>
            <button class="{data.user ? "" : "invisible"} p-1 mr-2 border rounded-md bg-red-600 text-white">Logout</button>
        </form>
    </header>

    <!-- Back button displayed conditionally based on the current page URL -->
    {#if $page.url.pathname !== '/' && $page.url.pathname !== '/login'}
        <a class="border p-2 bg-slate-400 text-center self-start ml-6 mb-6 min-w-32 flex space-x-4 justify-center"
            href={returnPath($page.url.pathname)}
        >
            <!-- SVG icon for the back button -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>

            <span>Back</span>
        </a>
    {/if}

    <!-- Main content slot where additional content can be inserted -->
    <main class="flex flex-col items-center px-2 max-w-full">
        <slot />
    </main>

    <!-- Popup component displayed conditionally based on the displayPopup store -->
    {#if $displayPopup.display}
        <Popup message={$displayPopup.message} type={$displayPopup.type}/>
    {/if}
</div>
