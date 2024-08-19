import { addNewUser, deleteUser, getEmployeeList, updateUser } from '$lib/db/db.server.js';
import { type RoleType, type User } from '$lib/db/schema.js';
import { computeHash } from '$lib/server/utils.js';
import { fail } from '@sveltejs/kit';

export async function load(event) {
    const employees = await getEmployeeList();
    return {
        employees,
    };
}

export const actions = {
    addEmployee: async (event) => {
        const formData = await event.request.formData();
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const phoneNumber = formData.get('phoneNumber') as string;
        const password = formData.get('password') as string;
        const role = formData.get('role') as RoleType;

        const data = [firstName, lastName, phoneNumber, password, role];
        
        if (!data.every((value) => value !== null && value !== ''))
            return fail(400, {missing: true});
        
        const passwordHash = computeHash(password);
        const userid = await addNewUser({firstName, lastName, phoneNumber, role, password: passwordHash});
        return {
            userid,
        };
    },
    editEmployee: async (event) => {
        const formData = await event.request.formData();
        const userid = formData.get('id') as string;
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const phoneNumber = formData.get('phoneNumber') as string;
        const password = formData.get('password') as string;
        const role = formData.get('role') as RoleType;
        const id = parseInt(userid);

        const data = [userid, firstName, lastName, phoneNumber, role];
        
        if (!data.every((value) => value !== null && value !== ''))
            return fail(400, {missing: true});

        const new_data: Partial<User> = {
            firstName, lastName, phoneNumber, role, 
        };
        if (password && password !== '')
            new_data.password = computeHash(password);

        await updateUser(id, new_data);
        return {
            success: true,
        };
    },
    deleteEmployee: async (event) => {
        const formData = await event.request.formData();
        const userid = formData.get('id') as string;

        if (!userid)
            return fail(400, {missing: true});

        const id = parseInt(userid);
        try {
            await deleteUser(id);
            return {
                success: true,
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
