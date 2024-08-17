import { writable, type Writable } from "svelte/store";

export const displayPopup: Writable<{
                                display: boolean,
                                message: string,
                                type: 'info' | 'error' | 'confirm',
                                cb?: (res: boolean) => void,
                            }> = writable({display: false, message: '', type: 'info'});

export function popup(message: string) {
    displayPopup.set({display: true, message, type: 'info'});
}

export function errorPopup(message: string) {
    displayPopup.set({display: true, message, type: 'error'});
}

export function confirmationPopup(message: string): Promise<boolean> {
    return new Promise((resolve) => {
        displayPopup.set({display: true, message, type: 'confirm', cb: resolve});
    });
}
