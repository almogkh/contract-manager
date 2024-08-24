import { addNewUser, deleteUser, getEmployeeList, updateUser } from '$lib/db/db.server.js';
import { type RoleType, type User } from '$lib/db/schema.js';
import { computeHash } from '$lib/server/utils.js';
import { fail } from '@sveltejs/kit';

/**
 * Load function to fetch the list of employees.
 * @param event - The load event from SvelteKit.
 * @returns An object containing the list of employees to be used on the client side.
 */
export async function load(event) {
    const employees = await getEmployeeList(); // Fetch the list of employees from the database.
    return {
        employees, // Return the employees list to be used in the page.
    };
}

// Actions object to handle server-side form submissions for employee management.
export const actions = {
    /**
     * Action to add a new employee to the database.
     * Validates form data and computes a hashed password before adding the employee.
     * @param event - The request event containing form data.
     * @returns An object containing the user ID of the newly added employee or a failure response if validation fails.
     */
    addEmployee: async (event) => {
        const formData = await event.request.formData(); // Parse form data from the request.
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const phoneNumber = formData.get('phoneNumber') as string;
        const password = formData.get('password') as string;
        const role = formData.get('role') as RoleType;

        const data = [firstName, lastName, phoneNumber, password, role];
        
        // Validate that all necessary fields are provided.
        if (!data.every((value) => value !== null && value !== ''))
            return fail(400, { missing: true });
        
        const passwordHash = computeHash(password); // Compute the hash for the password.
        const userid = await addNewUser({ firstName, lastName, phoneNumber, role, password: passwordHash }); // Add the new user to the database.
        return {
            userid, // Return the user ID of the newly added employee.
        };
    },

    /**
     * Action to edit an existing employee's details in the database.
     * Validates form data and updates the employee's information.
     * If a new password is provided, it is hashed before updating.
     * @param event - The request event containing form data.
     * @returns An object indicating success or a failure response if validation fails.
     */
    editEmployee: async (event) => {
        const formData = await event.request.formData(); // Parse form data from the request.
        const userid = formData.get('id') as string;
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const phoneNumber = formData.get('phoneNumber') as string;
        const password = formData.get('password') as string;
        const role = formData.get('role') as RoleType;
        const id = parseInt(userid);

        const data = [userid, firstName, lastName, phoneNumber, role];
        
        // Validate that all necessary fields are provided.
        if (!data.every((value) => value !== null && value !== ''))
            return fail(400, { missing: true });

        const new_data: Partial<User> = {
            firstName, lastName, phoneNumber, role, 
        };
        // If a new password is provided, hash it before updating.
        if (password && password !== '')
            new_data.password = computeHash(password);

        await updateUser(id, new_data); // Update the user's information in the database.
        return {
            success: true, // Return success if the operation is completed.
        };
    },

    /**
     * Action to delete an employee from the database.
     * Validates the provided user ID before attempting deletion.
     * @param event - The request event containing form data.
     * @returns An object indicating success or a failure response if validation fails.
     */
    deleteEmployee: async (event) => {
        const formData = await event.request.formData(); // Parse form data from the request.
        const userid = formData.get('id') as string;

        // Validate that the user ID is provided.
        if (!userid)
            return fail(400, {missing: true});

        const id = parseInt(userid);
        try {
            await deleteUser(id); // Delete the user from the database.
            return {
                success: true, // Return success if the operation is completed.
            };
        } catch (error: any) {
            if (error.code === '23503') {
                return fail(400, {
                    errorMessage: 'Can\'t delete employee because they are still assigned to a team.\nPlease ensure that the employee is removed from all responsibility before trying to delete them.',
                });
            }
        }
    },
};
