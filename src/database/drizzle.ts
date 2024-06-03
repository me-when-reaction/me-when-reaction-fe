"use server"

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres"

const client = postgres({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});


export async function DB() {
  return drizzle(client);
}

