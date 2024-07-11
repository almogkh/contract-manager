import { drizzle as drizzleVercel } from "drizzle-orm/vercel-postgres";
import { drizzle as drizzleNode } from "drizzle-orm/node-postgres";
import { sql as vercelSql } from "@vercel/postgres";
import Pg from "pg";
import * as schema from "./schema";
import { shortages, items, itemsInApartment, apartmentInScheduleItem, apartments, users,
    sessions, type Shortage, type ShortageStatus, type SafeUser, type Item, type User, type Apartment, type ScheduleItem,
    teams, scheduleItems, contracts } from "./schema";
import { and, eq, getTableColumns, lt, ne, sql, asc } from "drizzle-orm";
import { NODE_DB, POSTGRES_URL } from "$env/static/private";

const { Pool } = Pg;
export const db = NODE_DB
                    ? drizzleNode(new Pool({connectionString: POSTGRES_URL}))
                    : drizzleVercel(vercelSql, {schema});

export async function getUserSession(sessionid: string) {
    const session = db.select().from(sessions).where(and(eq(sessions.sessionid, sessionid), lt(sql`now()`, sessions.expirationTime))).as('session');
    const result = await db.select().from(users).rightJoin(session, eq(session.userid, users.id));
    if (result.length === 0)
        return null;
    return result[0].users;
}

export async function addNewUser(newUser: typeof users.$inferInsert) {
    const userid = (await db.insert(users).values(newUser).returning())[0].id;
    return userid;
}

export async function updateUser(userid: number, data: Partial<User>) {
    await db.update(users).set(data).where(eq(users.id, userid));
}

export async function deleteUser(userid: number) {
    await db.delete(users).where(eq(users.id, userid));
    
}

export async function getEmployeeList() {
    const employees = await db.select().from(users);
    return employees;
}

export async function getEmployeeTeams(user: SafeUser) {
    const teamList = await db.select().from(teams).where(eq(teams.lead, user.id));
    return teamList;
}

export async function getTeam(teamid: number) {
    const team = (await db.select().from(teams).where(eq(teams.id, teamid)))[0];
    return team;
}

export async function createTeam(name: string, lead: SafeUser, installers: string[]) {
    await db.insert(teams).values({
        name,
        lead: lead.id,
        installers
    });
}

export async function editTeam(id: number, name: string, installers: string[]) {
    await db.update(teams).set({name, installers}).where(eq(teams.id, id));
}

export async function deleteTeam(id: number) {
    await db.delete(teams).where(eq(teams.id, id));
}

export async function getTeamSchedule(teamid: number) {
    const rows = await db.select().from(scheduleItems).where(and(eq(scheduleItems.teamid, teamid), eq(scheduleItems.status, 'pending')))
                    .orderBy(asc(scheduleItems.time))
                    .innerJoin(apartmentInScheduleItem, eq(apartmentInScheduleItem.itemid, scheduleItems.id))
                    .innerJoin(apartments, and(
                            eq(apartments.contractid, apartmentInScheduleItem.contractid),
                            eq(apartments.floor, apartmentInScheduleItem.floor),
                            eq(apartments.number, apartmentInScheduleItem.number)
                    ))
                    .innerJoin(itemsInApartment, and(
                            eq(apartments.contractid, itemsInApartment.contractid),
                            eq(apartments.floor, itemsInApartment.floor),
                            eq(apartments.number, itemsInApartment.number)
                    ))
                    .innerJoin(items, eq(items.id, itemsInApartment.itemid));

    type ApartmentWithItems = (Apartment & {items: Item[]});
    const result = rows.reduce<Record<number, {item: ScheduleItem, apartments: ApartmentWithItems[]}>>((acc, row) => {
        const item = row.scheduleItems;
        const apartment = row.apartments;

        if (!acc[item.id]) {
            acc[item.id] = {item, apartments: []};
        }

        let apt = acc[item.id].apartments.find((value) => value.floor === apartment.floor && value.number === apartment.number);
        if (!apt) {
            apt = {...apartment, items: []};
            acc[item.id].apartments.push(apt);
        }

        row.items.quantity = row.itemsInApartment.quantity;
        apt.items.push(row.items);

        return acc;
    }, {});

    return Object.values(result);
}

export async function markSchedItemComplete(id: number) {
    await db.update(scheduleItems).set({status: 'complete'}).where(eq(scheduleItems.id, id));
}

export async function markApartmentComplete(contractid: number, floor: number, number: number) {
    await db.update(apartments).set({status: 'complete'}).where(and(
        eq(apartments.contractid, contractid),
        eq(apartments.floor, floor),
        eq(apartments.number, number)
    ));
}

export async function getContractById(id: number) {
    const contract = (await db.select().from(contracts).where(eq(contracts.id, id)))[0];
    return contract;
}

export async function getShortages() {
    const shortagesColumns = getTableColumns(shortages);
    const itemsColumns = getTableColumns(items);

    const res = await db.select({
                            ...shortagesColumns,
                            item: itemsColumns,
                        }).from(shortages).where(ne(shortages.status, 'complete'))
                        .innerJoin(items, eq(shortages.itemid, items.id));
    return res;
}

export async function updateShortage(id: number, status: ShortageStatus) {
    await db.update(shortages).set({status}).where(eq(shortages.id, id));
}

export async function getItems() {
    const itemsCols = getTableColumns(items);
    const shortagesCols = getTableColumns(shortages);
    const selectCols = {...itemsCols, shortage: shortagesCols};

    const rows = await db.select(selectCols).from(items)
                    .leftJoin(shortages, eq(shortages.itemid, items.id));
    
    const res = rows.reduce<Record<number, Item & {shortages: Shortage[]}>>((acc, row) => {
        const {shortage, ...item} = row;

        if (!acc[item.id]) {
            acc[item.id] = {...item, shortages: []};
        }

        if (shortage) {
            acc[item.id].shortages.push(shortage);
        }

        return acc;
    }, {});
    
    return Object.values(res);
}

export async function updateItem(item: Item) {
    const {id, ...rest} = item;
    await db.update(items).set(rest).where(eq(items.id, id));
}

export async function deleteItem(id: number) {
    await db.delete(items).where(eq(items.id, id));
}
