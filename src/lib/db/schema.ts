// Import necessary modules from drizzle-orm and PostgreSQL core
import { sql } from "drizzle-orm";
import { date, foreignKey, integer, pgEnum, pgTable, primaryKey, real, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { getItems } from "./db.server";

// Define the possible roles within the system
export const role = pgEnum('role', ['ceo', 'secretary', 'invmanager', 'teamlead']);
export type RoleType = typeof role.enumValues[number];

// Define the users table, including roles, contact information, and login credentials
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    firstName: text('firstName').notNull(),
    lastName: text('lastName').notNull(),
    role: role('role').notNull(),
    password: text('password').notNull(),
    phoneNumber: text('phoneNumber').notNull(),
});

export type User = typeof users.$inferSelect;
export type SafeUser = Omit<typeof users.$inferSelect, 'password'>;

// Define the sessions table for user session management
export const sessions = pgTable('sessions', {
    sessionid: uuid('sessionid').primaryKey().defaultRandom(),
    userid: integer('userid').references(() => users.id),
    expirationTime: timestamp('expirationTime', {withTimezone: true}),
});

// Define the possible contract types and statuses
export const contractType = pgEnum('contractType', ['newContract','repairedContract']);
export type ContractType = typeof contractType.enumValues[number];

export const contractStatus = pgEnum('contractStatus', ['new', 'inprogress', 'complete']);
export type ContractStatus = typeof contractStatus.enumValues[number];

// Define the contracts table, which stores information about construction contracts
export const contracts = pgTable('contracts', {
    id: serial('id').primaryKey(),
    address: text('address').notNull(),
    signingDate: date('signingDate').notNull(),
    dueDate: date('dueDate').notNull(),
    price: real('price').notNull(),
    status: contractStatus('status').notNull().default('new'),
    type: contractType('type').notNull().default('newContract'),
});

export type Contract = typeof contracts.$inferSelect;

// Define the teams table, which represents groups of installers and their leads
export const teams = pgTable('teams', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    lead: integer('lead').notNull().references(() => users.id),
    installers: text('installers').array().notNull().default(sql`'{}'`),
    // A team can work on multiple contracts simultaneously (commented out reference).
});

// Define the possible statuses for an apartment
export const apartmentStatus = pgEnum('apartmentStatus', ['pending', 'complete']);
export type ApartmentStatus = typeof apartmentStatus.enumValues[number];

// Define the possible types of work for scheduling
export const workType = pgEnum('workType', ['installFrame', 'installContents']);
export type WorkType = typeof workType.enumValues[number];

// Define the scheduleItems table, which tracks scheduled work items for teams
export const scheduleItems = pgTable('scheduleItems', {
    id: serial('id').primaryKey(),
    date: date('date').notNull(),
    contractid: integer('contractid').notNull().references(() => contracts.id),
    itemType: workType('itemtype').notNull(),
    teamid: integer('teamid').notNull().references(() => teams.id),
    description: text('description'),
});

export type ScheduleItem = typeof scheduleItems.$inferSelect;

// Define the apartments table, representing apartments associated with contracts
export const apartments = pgTable('apartments', {
    contractid: integer('contractid').notNull().references(() => contracts.id),
    floor: integer('floor').notNull(),
    number: integer('number').notNull(),
    windowWidth: real('windowWidth'),
    windowHeight: real('windowHeight'),
    doorWidth: real('doorWidth'),
    doorHeight: real('doorHeight'),
    status: apartmentStatus('status').notNull().default('pending'),
}, (table) => {
    return {
        pk: primaryKey({columns: [table.contractid, table.floor, table.number]}),  // Composite primary key
    };
});

export type Apartment = typeof apartments.$inferSelect;

// Define the apartmentInScheduleItem table, which links apartments to scheduled work items
export const apartmentInScheduleItem = pgTable('apartmentInScheduleItem', {
    contractid: integer('contractid').notNull(),
    floor: integer('floor').notNull(),
    number: integer('number').notNull(),
    itemid: integer('itemid').notNull().references(() => scheduleItems.id),
}, (table) => {
    return {
        ap_fk: foreignKey({
            name: 'apartments_fk',
            columns: [table.contractid, table.floor, table.number],
            foreignColumns: [apartments.contractid, apartments.floor, apartments.number],
        }),
        pk: primaryKey({
            name: 'apartmentsinscheduleitem_pk',
            columns: [table.contractid, table.floor, table.number, table.itemid],
        }),
    };
});

// Define the items table, which stores information about construction items (e.g., doors, windows)
export const items = pgTable('items', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    quantity: integer('quantity').notNull(),
    price: real('price').notNull(),
    width: real('width'),
    height: real('height'),
});

export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;

// Define the itemsInApartment table, which links items to specific apartments
export const itemsInApartment = pgTable('itemsInApartment', {
    itemid: integer('itemid').notNull(),
    quantity: integer('quantity').notNull(),
    contractid: integer('contractid').notNull(),
    floor: integer('floor').notNull(),
    number: integer('number').notNull(),
}, (table) => {
    return {
        pk: primaryKey({columns: [table.itemid, table.contractid, table.floor, table.number], name: 'itemsinapartment_pk'}),
        itemFk: foreignKey({
            name: 'itemsinapartment_fk_items',
            columns: [table.itemid],
            foreignColumns: [items.id],
        }),
        apartmentFk: foreignKey({
            name: 'itemsinapartment_fk_apartments',
            columns: [table.contractid, table.floor, table.number],
            foreignColumns: [apartments.contractid, apartments.floor, apartments.number],
        }),
    };
});

// Define the possible statuses for shortages in items
export const shortageStatus = pgEnum('shortageStatus', ['pending', 'ordered', 'complete']);
export type ShortageStatus = typeof shortageStatus.enumValues[number];

// Define the shortages table, which tracks items that are in short supply
export const shortages = pgTable('shortages', {
    id: serial('id').primaryKey(),
    itemid: integer('itemid').notNull().references(() => items.id),
    amount: integer('amount').notNull(),
    dueDate: date('dueDate').notNull(),
    status: shortageStatus('status').notNull(),
});

export type Shortage = typeof shortages.$inferSelect;

// Define a type representing a property of an item
export type ItemProp = Awaited<ReturnType<typeof getItems>>[number];

// Define the dueDates table, which tracks due dates for each floor in a contract
export const dueDates = pgTable('dueDates', {
    contractid: integer('contractid').notNull().references(() => contracts.id),
    floor: integer('floor').notNull(),
    date: date('date').notNull(),
}, (table) => {
    return {
        pk: primaryKey({
            name: 'duedates_pk',
            columns: [table.contractid, table.floor],
        }),
    };
});

export type DueDate = typeof dueDates.$inferSelect;
