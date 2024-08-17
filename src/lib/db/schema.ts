import { sql } from "drizzle-orm";
import { date, foreignKey, integer, pgEnum, pgTable, primaryKey, real, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { getItems } from "./db.server";

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

export type User = typeof users.$inferSelect;
export type SafeUser = Omit<typeof users.$inferSelect, 'password'>;

export const sessions = pgTable('sessions', {
    sessionid: uuid('sessionid').primaryKey().defaultRandom(),
    userid: integer('userid').references(() => users.id),
    expirationTime: timestamp('expirationTime', {withTimezone: true}),
});

export const contractType = pgEnum('contractType', ['newContract','repairedContract']);
export type ContractType = typeof contractType.enumValues[number];
export const contractStatus = pgEnum('contractStatus', ['new', 'inprogress', 'complete']);
export type ContractStatus = typeof contractStatus.enumValues[number];

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

export const teams = pgTable('teams', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    lead: integer('lead').notNull().references(() => users.id),
    //*** One team can work on several contracts parallel. ***
    //contract: integer('contract').references(() => contracts.id), 
    installers: text('installers').array().notNull().default(sql`'{}'`),
});

export const apartmentStatus = pgEnum('apartmentStatus', ['pending', 'complete']);
export type ApartmentStatus = typeof apartmentStatus.enumValues[number];

export const workType = pgEnum('workType', ['installFrame', 'installContents']);
export type WorkType = typeof workType.enumValues[number];

export const scheduleItems = pgTable('scheduleItems', {
    id: serial('id').primaryKey(),
    date: date('date').notNull(),
    contractid: integer('contractid').notNull().references(() => contracts.id),
    itemType: workType('itemtype').notNull(),
    teamid: integer('teamid').notNull().references(() => teams.id),
    description: text('description'),
});

export type ScheduleItem = typeof scheduleItems.$inferSelect;

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
        pk: primaryKey({columns: [table.contractid, table.floor, table.number]}),
    };
});

export type Apartment = typeof apartments.$inferSelect;

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

export const shortageStatus = pgEnum('shortageStatus', ['pending', 'ordered', 'complete']);
export type ShortageStatus = typeof shortageStatus.enumValues[number];

export const shortages = pgTable('shortages', {
    id: serial('id').primaryKey(),
    itemid: integer('itemid').notNull().references(() => items.id),
    amount: integer('amount').notNull(),
    dueDate: date('dueDate').notNull(),
    status: shortageStatus('status').notNull(),
});

export type Shortage = typeof shortages.$inferSelect;

export type ItemProp = Awaited<ReturnType<typeof getItems>>[number];

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
