import { integer, pgEnum, pgTable, primaryKey, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";

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
