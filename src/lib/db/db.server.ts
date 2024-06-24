import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql as vercelSql } from "@vercel/postgres";
import * as schema from "./schema";
import { and, eq, lt, sql } from "drizzle-orm";

export const db = drizzle(vercelSql, {schema});

export async function getUserSession(sessionid: string) {
    const session = db.select().from(schema.sessions).where(and(eq(schema.sessions.sessionid, sessionid), lt(sql`now()`, schema.sessions.expirationTime))).as('session');
    const result = await db.select({
        id: schema.users.id,
        firstName: schema.users.firstName,
        lastName: schema.users.lastName,
        role: schema.users.role,
    }).from(schema.users).rightJoin(session, eq(session.userid, schema.users.id));
    if (result.length === 0)
        return null;
    return result[0];
}
