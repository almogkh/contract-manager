export const pages = [
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
    }
];
