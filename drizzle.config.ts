import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.drizzle.ts",
  out: "./src/db/migrations",
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    databaseId: "8883f49a-44f7-423f-8e0f-5e3e7db8daaf",
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN!,
  },
});
