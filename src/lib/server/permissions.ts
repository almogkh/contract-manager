import type { RoleType } from "$lib/db/schema";

export const pages: {name: string, route: string, roles: RoleType[]}[] = [
    {
        name: 'View and edit employee data',
        route: '/employees',
        roles: [],
    },
    {
        name: 'View teams',
        route: '/teams',
        roles: ['teamlead'],
    },
    {
        name: 'Create new contract',
        route: '/contracts',
        roles: ['secretary'],
    },
    {
        name: 'Update contract status',
        route: '/contractStatus',
        roles: ['secretary'],
    },
    {
        name: 'Update daily schedule',
        route: '/updateSchedule',
        roles: ['secretary'],
    },
    {
        name: 'View contracts',
        route: '/viewContracts',
        roles: ['secretary'],
    },
    {
        name: 'View and handle shortages',
        route: '/shortages',
        roles: ['invmanager'],
    },
    { 
        name: 'View and update items',
        route: '/items',
        roles: ['invmanager'],
    },
];
