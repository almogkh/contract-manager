import { drizzle as drizzleVercel } from "drizzle-orm/vercel-postgres";
import { drizzle as drizzleNode } from "drizzle-orm/node-postgres";
import { sql as vercelSql } from "@vercel/postgres";
import Pg from "pg";
import * as schema from "./schema";
import { and, eq, lt, sql } from "drizzle-orm";

const { Pool } = Pg;
export const db = process.env.NODE_DB
                    ? drizzleNode(new Pool({connectionString: process.env.POSTGRES_URL}))
                    : drizzleVercel(vercelSql, {schema});

export async function getUserSession(sessionid: string) {
    const session = db.select().from(schema.sessions).where(and(eq(schema.sessions.sessionid, sessionid), lt(sql`now()`, schema.sessions.expirationTime))).as('session');
    const result = await db.select().from(schema.users).rightJoin(session, eq(session.userid, schema.users.id));
    if (result.length === 0)
        return null;
    return result[0].users;
}

export async function getEmployeeList() {
    const employees = await db.select().from(schema.users);
    return employees;
}
