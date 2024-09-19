import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from '@/database/schema';
import * as relation from '@/database/relations';

const sql = postgres(process.env.DATABASE_CONNECTION, {
  max: 2,
  idle_timeout: 3
});
export const DB = drizzle(sql, { schema: { ...schema, ...relation } });