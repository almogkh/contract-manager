// See https://kit.svelte.dev/docs/types#app

import type { SafeUser } from "$lib/db/schema";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: SafeUser | null,
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
