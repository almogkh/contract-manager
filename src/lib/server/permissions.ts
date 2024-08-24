import type { RoleType } from "$lib/db/schema";

/**
 * `pages` is an array of objects representing different pages/routes in the application
 * along with their associated roles and permissions.
 *
 * Each object in the `pages` array represents a specific page with the following properties:
 * - `name`: The display name of the page, describing its function.
 * - `route`: The URL route associated with the page.
 * - `roles`: An array of `RoleType` indicating which user roles are allowed to access the page.
 */
export const pages: {name: string, route: string, roles: RoleType[]}[] = [
    {
        name: 'View and edit employee data',
        route: '/employees',
        roles: [],  // No specific roles required, accessible by all authenticated users
    },
    {
        name: 'View teams',
        route: '/teams',
        roles: ['teamlead'],  // Accessible only by users with the 'teamlead' role
    },
    {
        name: 'Create new contract',
        route: '/contracts',
        roles: ['secretary'],  // Accessible only by users with the 'secretary' role
    },
    {
        name: 'Update contract status',
        route: '/contractStatus',
        roles: ['secretary'],  // Accessible only by users with the 'secretary' role
    },
    {
        name: 'Update daily schedule',
        route: '/updateSchedule',
        roles: ['secretary'],  // Accessible only by users with the 'secretary' role
    },
    {
        name: 'View contracts',
        route: '/viewContracts',
        roles: ['secretary'],  // Accessible only by users with the 'secretary' role
    },
    {
        name: 'View and handle shortages',
        route: '/shortages',
        roles: ['invmanager'],  // Accessible only by users with the 'invmanager' (inventory manager) role
    },
    { 
        name: 'View and update items',
        route: '/items',
        roles: ['invmanager'],  // Accessible only by users with the 'invmanager' role
    },
];
