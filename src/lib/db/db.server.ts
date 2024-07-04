import { drizzle as drizzleVercel } from "drizzle-orm/vercel-postgres";
import { drizzle as drizzleNode } from "drizzle-orm/node-postgres";
import { sql as vercelSql } from "@vercel/postgres";
import Pg from "pg";
import * as schema from "./schema";
import { users, sessions, type User, teams, scheduleItems, contracts } from "./schema";
import { and, eq, lt, sql } from "drizzle-orm";
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

export async function getEmployeeTeams(user: User) {
    const teamList = await db.select().from(teams).where(eq(teams.lead, user.id));
    return teamList;
}

export async function getTeam(teamid: number) {
    const team = (await db.select().from(teams).where(eq(teams.id, teamid)))[0];
    return team;
}

export async function getTeamSchedule(teamid: number) {
    const scheduleItemsArr = await db.select().from(scheduleItems).where(eq(scheduleItems.teamid, teamid));
    return scheduleItemsArr;
}

export async function getContractById(id: number) {
    const contract = (await db.select().from(contracts).where(eq(contracts.id, id)))[0];
    return contract;
}
