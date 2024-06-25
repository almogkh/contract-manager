<script>
    import { enhance } from "$app/forms";
import "../app.css";

    export let data;
</script>

<div class="bg-slate-300 h-screen flex flex-col items-center">
    <header class="flex justify-end w-full p-2 border-b mb-4">
        <form method="post" action="/login?/logout" use:enhance>
            <button class="{data.user ? "" : "invisible"} p-1 mr-2 border rounded-md bg-red-600 text-white">Logout</button>
        </form>
    </header>

    <main class="flex flex-col items-center">
        <slot />
    </main>

</div>
