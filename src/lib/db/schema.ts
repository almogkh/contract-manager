import { date, decimal, foreignKey, integer, pgEnum, pgTable, primaryKey, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const role = pgEnum('role', ['ceo', 'secretary', 'invmanager', 'teamlead']);
export type RoleType = typeof role.enumValues[number];

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    firstName: text('firstName').notNull(),
    lastName: text('lastName').notNull(),
    role: role('role').notNull(),
    password: text('password').notNull(),
    phoneNumber: text('phoneNumber').notNull(),
});

export const sessions = pgTable('sessions', {
    sessionid: uuid('sessionid').primaryKey().defaultRandom(),
    userid: integer('userid').references(() => users.id),
    expirationTime: timestamp('expirationTime', {withTimezone: true}),
});

export const teams = pgTable('teams', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    lead: integer('lead').references(() => users.id),
    //contract: integer(contract).references(() => contracts.id);
});

export const workType = pgEnum('workType', ['installFrame', 'installContents']);
export type WorkType = typeof workType.enumValues[number];

export const scheduleStatus = pgEnum('scheduleStatus', ['pending', 'assigned', 'complete']);
export type ScheduleStatus = typeof scheduleStatus.enumValues[number];

export const scheduleItems = pgTable('scheduleItems', {
    address: text('address'),
    time: timestamp('time', {withTimezone: true}),
    type: workType('type'),
    status: scheduleStatus('status').default('pending').notNull(),
}, (table) => {
    return {
        pk: primaryKey({columns: [table.address, table.type, table.time]}),
    };
});

export const contractStatus = pgEnum('contractStatus', ['new', 'signed', 'inprogress', 'complete']);
export type ContractStatus = typeof contractStatus.enumValues[number];

export const contracts = pgTable('contracts', {
    id: serial('id').primaryKey(),
    address: text('address').notNull(),
    signingDate: date('signingDate').notNull(),
    dueDate: date('dueDate').notNull(),
    price: decimal('price').notNull(),
    status: contractStatus('status').notNull(),
});

export const items = pgTable('items', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    quantity: integer('quantity').notNull(),
    price: decimal('price').notNull(),
    width: decimal('width'),
    height: decimal('height'),
});

export const apartmentStatus = pgEnum('apartmentStatus', ['pending', 'inprogress', 'complete']);
export type ApartmentStatus = typeof apartmentStatus.enumValues[number];

export const apartments = pgTable('apartments', {
    contractid: integer('contractid').references(() => contracts.id),
    floor: integer('floor').notNull(),
    number: integer('number').notNull(),
    windowWidth: decimal('windowWidth'),
    windowHeight: decimal('windowHeight'),
    doorWidth: decimal('doorWidth'),
    doorHeight: decimal('doorHeight'),
    status: apartmentStatus('status').notNull(),
}, (table) => {
    return {
        pk: primaryKey({columns: [table.contractid, table.floor, table.number]}),
    };
});

export const itemsInApartment = pgTable('itemsInApartment', {
    itemid: integer('itemid'),
    contractid: integer('contractid'),
    floor: integer('floor'),
    number: integer('number'),
}, (table) => {
    return {
        pk: primaryKey({columns: [table.itemid, table.contractid, table.floor, table.number]}),
        itemFk: foreignKey({
            columns: [table.itemid],
            foreignColumns: [items.id],
        }),
        apartmentFk: foreignKey({
            columns: [table.contractid, table.floor, table.number],
            foreignColumns: [apartments.contractid, apartments.floor, apartments.number],
        }),
    };
});
