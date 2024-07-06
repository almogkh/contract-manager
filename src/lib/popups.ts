import { writable } from "svelte/store";

export const displayPopup = writable({display: false, message: '', type: 'info'});

export function popup(message: any) {
    displayPopup.set({display: true, message, type: 'info'});
}

export function errorPopup(message: any) {
    displayPopup.set({display: true, message, type: 'error'});
}
