import type z from "zod";

import type {
  drizzleZodRecordsSchema,
  drizzleZodUsersSchema,
} from "./schema.zod";

export type DrizzleZod_Records_Select = z.infer<
  typeof drizzleZodRecordsSchema.select
>;
export type DrizzleZod_Records_Insert = z.infer<
  typeof drizzleZodRecordsSchema.insert
>;

export type DrizzleZod_Users_Select = z.infer<
  typeof drizzleZodUsersSchema.select
>;
