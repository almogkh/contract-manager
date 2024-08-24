// Importing necessary libraries and modules
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

// Initialize the database connection
const { Pool } = Pg;

export const db = NODE_DB
                    ? drizzleNode(new Pool({connectionString: POSTGRES_URL}))  // If NODE_DB is defined, use Node.js-based connection
                    : drizzleVercel(vercelSql, {schema});  // Otherwise, use Vercel's serverless connection

/**
 * Retrieve a user session by session ID, ensuring the session is still valid.
 * @param sessionid - The ID of the session to retrieve.
 * @returns The user associated with the session if valid, otherwise null.
 */
export async function getUserSession(sessionid: string) {
    const session = db.select().from(sessions).where(and(eq(sessions.sessionid, sessionid), lt(sql`now()`, sessions.expirationTime))).as('session');
    const result = await db.select().from(users).rightJoin(session, eq(session.userid, users.id));
    if (result.length === 0)
        return null;
    return result[0].users;
}

/**
 * Add a new user to the database.
 * @param newUser - The user data to insert.
 * @returns The ID of the newly created user.
 */
export async function addNewUser(newUser: typeof users.$inferInsert) {
    const userid = (await db.insert(users).values(newUser).returning())[0].id;
    return userid;
}

/**
 * Update user data for a specific user ID.
 * @param userid - The ID of the user to update.
 * @param data - Partial user data to update.
 */
export async function updateUser(userid: number, data: Partial<User>) {
    await db.update(users).set(data).where(eq(users.id, userid));
}

/**
 * Add a new contract to the database.
 * @param newContract - The contract data to insert.
 * @returns The newly created contract.
 */
export async function addContract(newContract: typeof contracts.$inferInsert){
    return await db.insert(contracts).values(newContract).returning();
}

/**
 * Add a new apartment to the database, and associate doors and windows if specified.
 * @param newApartment - The apartment data to insert.
 */
export async function addApartment(newApartment: typeof apartments.$inferInsert){
    await db.insert(apartments).values(newApartment);
    
    // Associate door items with the apartment if door dimensions are provided
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
    // Associate window items with the apartment if window dimensions are provided
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

/**
 * Delete a user from the database by their user ID.
 * @param userid - The ID of the user to delete.
 */
export async function deleteUser(userid: number) {
    await db.delete(users).where(eq(users.id, userid));
}

/**
 * Get a list of all employees.
 * @returns A list of users from the database.
 */
export async function getEmployeeList() {
    const employees = await db.select().from(users);
    return employees;
}

/**
 * Get the list of teams that a specific user leads.
 * @param user - The user whose teams are to be retrieved.
 * @returns A list of teams led by the user.
 */
export async function getEmployeeTeams(user: SafeUser) {
    const teamList = await db.select().from(teams).where(eq(teams.lead, user.id));
    return teamList;
}

/**
 * Get a specific team by its ID.
 * @param teamid - The ID of the team to retrieve.
 * @returns The team data.
 */
export async function getTeam(teamid: number) {
    const team = (await db.select().from(teams).where(eq(teams.id, teamid)))[0];
    return team;
}

/**
 * Get a list of all teams.
 * @returns A list of all teams in the database.
 */
export async function getTeams() {
    const teamsLeadsId = await db.select().from(teams);
    return teamsLeadsId;
}

/**
 * Create a new team with a given name, lead, and installers.
 * @param name - The name of the team.
 * @param lead - The lead user of the team.
 * @param installers - The list of installers in the team.
 */
export async function createTeam(name: string, lead: SafeUser, installers: string[]) {
    await db.insert(teams).values({
        name,
        lead: lead.id,
        installers
    });
}

/**
 * Edit an existing team by its ID, updating the name and installers.
 * @param id - The ID of the team to update.
 * @param name - The new name of the team.
 * @param installers - The updated list of installers.
 */
export async function editTeam(id: number, name: string, installers: string[]) {
    await db.update(teams).set({name, installers}).where(eq(teams.id, id));
}

/**
 * Delete a team from the database by its ID.
 * @param id - The ID of the team to delete.
 */
export async function deleteTeam(id: number) {
    await db.delete(teams).where(eq(teams.id, id));
}

/**
 * Get the schedule for a specific team by its ID.
 * @param teamid - The ID of the team to retrieve the schedule for.
 * @returns The schedule data for the team, including associated apartments and items.
 */
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

/**
 * Get the schedules for all teams.
 * @returns A list of schedules for all teams.
 */
export async function getAllTeamSchedules() {
    const ids = (await db.select({id: teams.id}).from(teams)).map(val => val.id);
    const items: Record<number, Awaited<ReturnType<typeof getTeamSchedule>>> = {};
    for (const id of ids) {
        items[id] = await getTeamSchedule(id);
    }

    return Object.values(items);
}

/**
 * Mark an apartment as complete by updating its status in the database.
 * @param contractid - The contract ID associated with the apartment.
 * @param floor - The floor number of the apartment.
 * @param number - The apartment number.
 */
export async function markApartmentComplete(contractid: number, floor: number, number: number) {
    await db.update(apartments).set({status: 'complete'}).where(and(
        eq(apartments.contractid, contractid),
        eq(apartments.floor, floor),
        eq(apartments.number, number)
    ));
}

/**
 * Get a list of all pending apartments.
 * @returns A list of apartments that are pending completion.
 */
export async function getApartmentsList(){
    const apartmentsList = await db.select().from(apartments).where(eq(apartments.status, 'pending'));
    return apartmentsList;
}

/**
 * Get a list of apartments by a specific contract ID.
 * @param id - The contract ID.
 * @returns A list of apartments associated with the given contract ID.
 */
export async function getApartmentsListById(id: number){
    const apartmentsList = await db
        .select({
            windowWidth: apartments.windowWidth,
            windowHeight: apartments.windowHeight,
            doorWidth: apartments.doorWidth,
            doorHeight: apartments.doorHeight
        })
        .from(apartments).where(eq(apartments.contractid, id));

    return apartmentsList;
}

/**
 * Get contracts filtered by their status.
 * @param status - The status of the contracts to filter by.
 * @returns A list of contracts and their associated apartments.
 */
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

/**
 * Get a list of all active contracts.
 * @returns A list of contracts that are either in progress or new.
 */
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

/**
 * Get a list of all contracts.
 * @returns A list of all contracts in the database.
 */
export async function getContractsList(){
    return await db.select().from(contracts);
}

/**
 * Add a new schedule item and associate it with apartments.
 * @param scheduleItem - The schedule item to add, along with associated apartments.
 */
export async function addScheduleItem(scheduleItem: typeof scheduleItems.$inferInsert & {apartments: {floor: number, number: number}[]}) {
    const {apartments, ...schedItem} = scheduleItem;
    const item = (await db.insert(scheduleItems).values(schedItem).returning())[0];
    for (const apartment of apartments) {
        await db.insert(apartmentInScheduleItem).values({contractid: scheduleItem.contractid, itemid: item.id, floor: apartment.floor, number: apartment.number});
    }
}

/**
 * Get a list of all schedule items.
 * @returns A list of schedule items.
 */
export async function getScheduleItem() {
    return await db.select().from(scheduleItems);
}

/**
 * Delete a schedule item and its associated apartment links by ID.
 * @param id - The ID of the schedule item to delete.
 */
export async function deleteScheduleItem(id: number){
    await db.delete(apartmentInScheduleItem).where(eq(apartmentInScheduleItem.itemid, id));
    await db.delete(scheduleItems).where(eq(scheduleItems.id, id));
}

/**
 * Update the status of a contract.
 * @param id - The ID of the contract to update.
 * @param status - The new status to set for the contract.
 */
export async function updateContractStatus(id: number, status: ContractStatus) {
    await db.update(contracts).set({status}).where(eq(contracts.id, id));
}

/**
 * Update the status of an apartment to 'complete'.
 * @param id - The contract ID associated with the apartment.
 * @param floor - The floor number of the apartment.
 * @param number - The apartment number.
 */
export async function updateApartmentStatus(id: number, floor: number, number: number) {
    await db.update(apartments).set({status: 'complete'})
    .where(and( eq(apartments.contractid, id),
                eq(apartments.floor, floor),
                eq(apartments.number, number)
            ));
}

/**
 * Get a list of all current shortages.
 * @returns A list of shortages that are not marked as 'complete'.
 */
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

/**
 * Update the status of a specific shortage.
 * @param id - The ID of the shortage to update.
 * @param status - The new status to set for the shortage.
 */
export async function updateShortage(id: number, status: ShortageStatus) {
    await db.update(shortages).set({status}).where(eq(shortages.id, id));
}

/**
 * Update an existing schedule item and its associated apartments.
 * @param scheduleItem - The updated schedule item data.
 * @param id - The ID of the schedule item to update.
 */
export async function updateSchedule(scheduleItem: typeof scheduleItems.$inferInsert & {apartments: {floor: number, number: number}[]}, id: number) {
    const {apartments, ...item} = scheduleItem;
    await db.update(scheduleItems).set(item).where(eq(scheduleItems.id, id));

    const schedAparts = await db.select().from(apartmentInScheduleItem).where(eq(apartmentInScheduleItem.itemid, id));
    const toAdd = apartments.filter(val => !schedAparts.find(v => v.floor === val.floor && v.number === val.number))
                        .map(val => {return {...val, contractid: item.contractid, itemid: id}});
    const toRemove = schedAparts.filter(val => !apartments.find(v => v.floor === val.floor && v.number === val.number));

    await db.insert(apartmentInScheduleItem).values(toAdd);
    for (const row of toRemove) {
        await db.delete(apartmentInScheduleItem).where(and(
                                                        eq(apartmentInScheduleItem.itemid, id),
                                                        eq(apartmentInScheduleItem.contractid, row.contractid),
                                                        eq(apartmentInScheduleItem.floor, row.floor),
                                                        eq(apartmentInScheduleItem.number, row.number)));
    }
}

/**
 * Retrieve all item data from the database.
 * @returns A list of all items.
 */
export async function getItemsData(){
    return await db.select().from(items);
}

/**
 * Get a list of all items, along with associated shortages.
 * @returns A list of items, each with associated shortages if any.
 */
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

/**
 * Add a new item to the database.
 * @param item - The new item data to insert.
 */
export async function addItem(item: NewItem) {
    await db.insert(items).values(item);
}

/**
 * Update an existing item in the database.
 * @param item - The item data to update, including its ID.
 */
export async function updateItem(item: Item) {
    const {id, ...rest} = item;
    await db.update(items).set(rest).where(eq(items.id, id));
}

/**
 * Retrieve an item by its name, width, and height.
 * @param name - The name of the item to search for.
 * @param width - The width of the item.
 * @param height - The height of the item.
 * @returns The item if found, otherwise null.
 */
export async function getItemByNWH(name: string, width: number, height: number) {
    const item = await db.select().from(items).where(and(eq(items.name, name), eq(items.width, width), eq(items.height, height)));
    return item.length > 0 ? item[0] : null;
}

/**
 * Create a new shortage entry in the database.
 * @param itemId - The ID of the item associated with the shortage
 * @param amount - The amount of the item that is short.
 * @param dueDate - The due date by which the shortage needs to be resolved.
 */
export async function createShortage(itemId: number, amount: number, dueDate: string) {
    await db.insert(shortages).values({
        itemid: itemId,
        amount: amount,
        dueDate: dueDate,
        status: 'pending'
    });
}

/**
 * Update the quantity of an item by reducing it by one.
 * @param id - The ID of the item to update.
 */
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

/**
 * Delete an item from the database by its ID.
 * @param id - The ID of the item to delete.
 */
export async function deleteItem(id: number) {
    await db.delete(items).where(eq(items.id, id));
}

/**
 * Add due dates for floors in a contract.
 * @param dates - The due dates to insert, each associated with a specific floor in a contract.
 */
export async function addFloorDueDates(dates: DueDate[]) {
    await db.insert(dueDates).values(dates);
}

/**
 * Retrieve all due dates for floors in contracts.
 * @returns A list of due dates associated with floors in contracts.
 */
export async function getFloorDueDates() {
    return await db.select().from(dueDates);
}