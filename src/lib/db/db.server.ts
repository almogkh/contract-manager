import { drizzle as drizzleVercel } from "drizzle-orm/vercel-postgres";
import { drizzle as drizzleNode } from "drizzle-orm/node-postgres";
import { sql as vercelSql } from "@vercel/postgres";
import Pg from "pg";
import * as schema from "./schema";
import { shortages, items, itemsInApartment, apartmentInScheduleItem, apartments, users,
    sessions, type Shortage, type ShortageStatus, type ContractStatus, type SafeUser, type Item, type User, type Apartment, type ScheduleItem,
    type NewItem, type Contract, type DueDate, teams, scheduleItems, dueDates, contracts } from "./schema";
import { and, eq, getTableColumns, lt, ne, sql, asc, or } from "drizzle-orm";
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

export async function addContract(newContract: typeof contracts.$inferInsert){
    return await db.insert(contracts).values(newContract).returning();
}

export async function addApartment(newApartment: typeof apartments.$inferInsert){
    await db.insert(apartments).values(newApartment);
    if (newApartment.doorHeight) {
        const door = (await getItemByNWH('Door', newApartment.doorWidth!, newApartment.doorHeight))!;
        await db.insert(itemsInApartment).values({
                                            number: newApartment.number,
                                            contractid: newApartment.contractid,
                                            floor: newApartment.floor,
                                            itemid: door.id,
                                            quantity: 1,
                                        });
    }
    if (newApartment.windowHeight) {
        const window = (await getItemByNWH('Window', newApartment.windowWidth!, newApartment.windowHeight))!;
        await db.insert(itemsInApartment).values({
                                            number: newApartment.number,
                                            contractid: newApartment.contractid,
                                            floor: newApartment.floor,
                                            itemid: window.id,
                                            quantity: 1,
                                        });
    }
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

export async function getTeams() {
    const teamsLeadsId = await db.select().from(teams);
    return teamsLeadsId;
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
    const rows = await db.select().from(scheduleItems).where(eq(scheduleItems.teamid, teamid))
                    .orderBy(asc(scheduleItems.date))
                    .innerJoin(apartmentInScheduleItem, eq(apartmentInScheduleItem.itemid, scheduleItems.id))
                    .innerJoin(apartments, and(
                            eq(apartments.status, 'pending'),
                            eq(apartments.contractid, apartmentInScheduleItem.contractid),
                            eq(apartments.floor, apartmentInScheduleItem.floor),
                            eq(apartments.number, apartmentInScheduleItem.number)
                    ))
                    .innerJoin(itemsInApartment, and(
                            eq(apartments.contractid, itemsInApartment.contractid),
                            eq(apartments.floor, itemsInApartment.floor),
                            eq(apartments.number, itemsInApartment.number)
                    ))
                    .innerJoin(items, eq(items.id, itemsInApartment.itemid))
                    .innerJoin(contracts, eq(apartments.contractid, contracts.id));

    type ApartmentWithItems = (Apartment & {items: Item[]});
    const result = rows.reduce<Record<number, {item: ScheduleItem & {address: string}, apartments: ApartmentWithItems[]}>>((acc, row) => {
        const item = {...row.scheduleItems, address: row.contracts.address};
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

export async function getAllTeamSchedules() {
    const ids = (await db.select({id: teams.id}).from(teams)).map(val => val.id);
    const items: Record<number, Awaited<ReturnType<typeof getTeamSchedule>>> = {};
    for (const id of ids) {
        items[id] = await getTeamSchedule(id);
    }

    return Object.values(items);
}

export async function markApartmentComplete(contractid: number, floor: number, number: number) {
    await db.update(apartments).set({status: 'complete'}).where(and(
        eq(apartments.contractid, contractid),
        eq(apartments.floor, floor),
        eq(apartments.number, number)
    ));
}

export async function getApartmentsList(){
    const apartmentsList = await db.select().from(apartments).where(eq(apartments.status, 'pending'));
    return apartmentsList;
}

export async function getApartmentsListById(id: number){
    const apartmentsList = await db
    .select({
        windowWidth: apartments.windowWidth,
        windowHeight: apartments.windowHeight,
        doorWidth: apartments.doorWidth,
        doorHeight: apartments.doorHeight
    })
    .from(apartments).where(eq(apartments.contractid, id))

    return apartmentsList;
}

export async function getContractsByStatus(status: ContractStatus){
    const rows = await db.select().from(contracts).where(eq(contracts.status, status))
                    .innerJoin(apartments, eq(apartments.contractid, contracts.id))
                    .orderBy(asc(apartments.floor), asc(apartments.number));
    
    const result: Record<number, Contract & {apartments: Apartment[]}> = {};
    for (const row of rows) {
        if (!result[row.contracts.id]) {
            result[row.contracts.id] = {...row.contracts, apartments: []};
        }

        result[row.contracts.id].apartments.push(row.apartments);
    }

    return result;
}

export async function getActiveContracts() {
    return await db.select({ id: contracts.id, status: contracts.status, dueDate: contracts.dueDate} )
        .from(contracts)
        .where(
            or(
                eq(contracts.status, "inprogress"),
                eq(contracts.status, "new")
            )
        );
}

export async function getContractsList(){
    return await db.select().from(contracts);
}

export async function addScheduleItem(scheduleItem: typeof scheduleItems.$inferInsert & {apartments: {floor: number, number: number}[]}) {
    const {apartments, ...schedItem} = scheduleItem;
    const item = (await db.insert(scheduleItems).values(schedItem).returning())[0];
    for (const apartment of apartments) {
        await db.insert(apartmentInScheduleItem).values({contractid: scheduleItem.contractid, itemid: item.id, floor: apartment.floor, number: apartment.number});
    }
}

export async function getScheduleItem() {
    return await db.select().from(scheduleItems);
}

export async function deleteScheduleItem(id: number){
    await db.delete(apartmentInScheduleItem).where(eq(apartmentInScheduleItem.itemid, id));
    await db.delete(scheduleItems).where(eq(scheduleItems.id,id));
}

export async function updateContractStatus(id: number, status: ContractStatus) {
    await db.update(contracts).set({status}).where(eq(contracts.id, id));
}

export async function updateApartmentStatus(id: number, floor: number, number: number) {
    await db.update(apartments).set({status: 'complete'})
    .where(and( eq(apartments.contractid, id),
                eq(apartments.floor, floor),
                eq(apartments.number, number)
            ));
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

export async function updateSchedule(scheduleItem: typeof scheduleItems.$inferInsert & {apartments: {floor: number, number: number}[]}, id: number) {
    const {apartments, ...item} = scheduleItem;
    await db.update(scheduleItems).set(item).where(eq(scheduleItems.id, id));

    const schedAparts = await db.select().from(apartmentInScheduleItem).where(eq(apartmentInScheduleItem.itemid, id));
    const toAdd = apartments.filter(val => !schedAparts.find(v => v.floor === val.floor && v.number === val.number))
                        .map(val => {return {...val, contractid: item.contractid, itemid: id}});
    const toRemove = schedAparts.filter(val => !apartments.find(v => v.floor === val.floor && v.number === val.number));

    if (toAdd.length > 0)
        await db.insert(apartmentInScheduleItem).values(toAdd);

    for (const row of toRemove) {
        await db.delete(apartmentInScheduleItem).where(and(
                                                        eq(apartmentInScheduleItem.itemid, id),
                                                        eq(apartmentInScheduleItem.contractid, row.contractid),
                                                        eq(apartmentInScheduleItem.floor, row.floor),
                                                        eq(apartmentInScheduleItem.number, row.number)));
    }
}

export async function getItemsData(){
    return await db.select().from(items);
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

export async function addItem(item: NewItem) {
    await db.insert(items).values(item);
}

export async function updateItem(item: Item) {
    const {id, ...rest} = item;
    await db.update(items).set(rest).where(eq(items.id, id));
}

export async function getItemByNWH(name: string, width: number, height: number) {
    const item = await db.select().from(items).where(and(eq(items.name, name), eq(items.width, width), eq(items.height, height)));
    return item.length > 0 ? item[0] : null;
}

export async function createShortage(itemId: number, amount: number, dueDate: string) {
    await db.insert(shortages).values({
        itemid: itemId,
        amount: amount,
        dueDate: dueDate,
        status: 'pending'
    });
}

export async function updateItemQuantity(id: number) {
    const [currentItem] = await db
        .select({ quantity: items.quantity })
        .from(items)
        .where(eq(items.id, id));

    if (currentItem && currentItem.quantity > 0) {
        const newQuantity = currentItem.quantity - 1;

        await db.update(items)
            .set({ quantity: newQuantity })
            .where(eq(items.id, id));
    }
}

export async function deleteItem(id: number) {
    await db.delete(items).where(eq(items.id, id));
}

export async function addFloorDueDates(dates: DueDate[]) {
    await db.insert(dueDates).values(dates);
}

export async function getFloorDueDates() {
    return await db.select().from(dueDates);
}
