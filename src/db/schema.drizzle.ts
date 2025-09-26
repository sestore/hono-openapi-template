import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const records = sqliteTable("records", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  text: text("text", { length: 200 }).notNull(),
});

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name", { length: 50 }).notNull(),
  phoneNumber: text("phone_number", { length: 13 }).notNull().unique(),
  passwordHash: text("password_hash", { length: 255 }).notNull(),
});
