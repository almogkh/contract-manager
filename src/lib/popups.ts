import { writable, type Writable } from "svelte/store";

// Define a writable store `displayPopup` that controls the state of a popup dialog.
// The store holds an object with the following properties:
// - `display`: A boolean indicating whether the popup should be displayed.
// - `message`: A string containing the message to be displayed in the popup.
// - `type`: A string that specifies the type of popup ('info', 'error', 'confirm', or 'help').
// - `cb`: An optional callback function used for handling user responses in confirmation popups.
export const displayPopup: Writable<{
                                display: boolean,
                                message: string,
                                type: 'info' | 'error' | 'confirm' | 'help',
                                cb?: (res: boolean) => void,
                            }> = writable({display: false, message: '', type: 'info'});

export const helpText = writable('');

/**
 * Displays an informational popup with the specified message.
 * @param message - The message to be displayed in the popup.
 */
export function popup(message: string) {
    displayPopup.set({ display: true, message, type: 'info' });
}

/**
 * Displays a help popup with the specified message.
 * @param message - The message to be displayed in the popup.
 */
export function helpPopup(message: string) {
    displayPopup.set({display: true, message, type: 'help'})
}

/**
 * Displays an error popup with the specified message.
 * @param message - The message to be displayed in the popup.
 */
export function errorPopup(message: string) {
    displayPopup.set({ display: true, message, type: 'error' });
}

/**
 * Displays a confirmation popup with the specified message and returns a Promise.
 * The Promise resolves to `true` if the user confirms, or `false` if the user declines.
 * @param message - The message to be displayed in the popup.
 * @returns A Promise that resolves to a boolean based on the user's response.
 */
export function confirmationPopup(message: string): Promise<boolean> {
    return new Promise((resolve) => {
        displayPopup.set({ display: true, message, type: 'confirm', cb: resolve });
    });
}
