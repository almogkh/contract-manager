import { db, getEmployeeList } from '$lib/db/db.server.js';
import { users, type RoleType } from '$lib/db/schema.js';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function load(event) {
    const employees = await getEmployeeList();
    return {
        employees,
    };
}

export const actions = {
    editEmployee: async (event) => {
        const formData = await event.request.formData();
        const userid = formData.get('id') as string;
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const phoneNumber = formData.get('phoneNumber') as string;
        const password = formData.get('password') as string;
        const role = formData.get('role') as RoleType;
        const submission = formData.get('submission') as string;
        const id = parseInt(userid);

        const data = [userid, firstName, lastName, phoneNumber, role, submission];
        
        if (!data.every((value) => value !== null && value !== ''))
            return fail(400, {missing: true});

        if (submission === 'delete') {
            await db.delete(users).where(eq(users.id, id));
            return {
                success: true,
            };
        } else if (submission !== 'save') {
            return fail(400, {invalid: true});
        }

        const new_data: Partial<typeof users.$inferSelect> = {
            firstName, lastName, phoneNumber, role, 
        };
        if (password && password !== '')
            new_data.password = password;

        await db.update(users).set(new_data).where(eq(users.id, id));
        return {
            success: true,
        };
    }
};
