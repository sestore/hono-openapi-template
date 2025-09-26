import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.drizzle.ts",
  out: "./src/db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "./.wrangler/state/v3/d1/miniflare-D1DatabaseObject/23bceb4448b9eed83e295d36363961e8f57ddf66252eb56a09572577a95301dc.sqlite",
  },
});
