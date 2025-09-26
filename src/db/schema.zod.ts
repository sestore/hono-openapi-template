import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { records, users } from "./schema.drizzle";

export const drizzleZodRecordsSchema = {
  select: createSelectSchema(records),
  insert: createInsertSchema(records, {
    text: (field) =>
      field
        .min(1, "Text is required")
        .max(500, "Text too long")
        .trim()
        .refine((val) => val.length > 0, "Text cannot be empty after trimming"),
  }).omit({ id: true }),
};

export const drizzleZodUsersSchema = {
  select: createSelectSchema(users),
};
