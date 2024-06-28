import { integer, real, pgEnum, pgTable, serial, text, timestamp, uuid, date } from "drizzle-orm/pg-core";

export const role = pgEnum('role', ['ceo', 'secretary', 'invmanager', 'teamlead']);
export const contractStatus = pgEnum('contractStatus', ['pending', 'processing', 'complete']);
export const contractType = pgEnum('contractType', ['newContract','repairedContract']);

export type RoleType = 'ceo' | 'secretary' | 'invmanager' | 'teamlead';
export type StatusType = 'pending' | 'processing' | 'complete';
export type ContractType = 'newContract' | 'repairedContract';

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

export const contracts = pgTable('contracts', {
    contractId: serial('contractId').primaryKey(),
    userid: text('address').notNull(),
    signingDate: date('signingDate').notNull(),
    price: real('price').notNull(),
    dueDate: date('dueDate').notNull(),
    contractType: contractType('contractType').notNull().default('newContract'),
    contractStatus: contractStatus('contractStatus').notNull().default('pending'),
});
