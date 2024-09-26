import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/database/schema.ts",
  out: "./src/database/migration",
  dbCredentials: {
    url: process.env.DATABASE_CONNECTION
  }
});