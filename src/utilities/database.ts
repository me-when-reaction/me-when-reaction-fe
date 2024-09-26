import { SQL, sql } from "drizzle-orm";

export function sqlArray(array: any[]): SQL {
  return sql`ARRAY[${sql.join(array, sql.raw(","))}]::text[]`;
}