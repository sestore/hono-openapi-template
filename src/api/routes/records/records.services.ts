import { tryCatch, type Result } from "catch-wrap";
import { eq } from "drizzle-orm";

import type {
  DrizzleZod_Records_Insert,
  DrizzleZod_Records_Select,
} from "@/db/schema.types";
import type { DrizzleD1WithSchema } from "@/types";

import { records } from "@/db/schema.drizzle";

export const createRecord = async (
  db: DrizzleD1WithSchema,
  todoData: DrizzleZod_Records_Insert,
): Promise<Result<DrizzleZod_Records_Select>> => {
  return await tryCatch(async () => {
    const [createdRecord] = await db
      .insert(records)
      .values(todoData)
      .returning();
    return createdRecord;
  });
};

export const getAllRecords = async (
  db: DrizzleD1WithSchema,
): Promise<Result<DrizzleZod_Records_Select[]>> => {
  return await tryCatch(db.query.records.findMany());
};

export const getRecordById = async (
  db: DrizzleD1WithSchema,
  id: number,
): Promise<Result<DrizzleZod_Records_Select | undefined>> => {
  return await tryCatch(
    db.query.records.findFirst({
      where: (fields, operators) => operators.eq(fields.id, id),
    }),
  );
};

export const updateRecord = async (
  db: DrizzleD1WithSchema,
  id: number,
  updates: DrizzleZod_Records_Insert,
): Promise<Result<DrizzleZod_Records_Select | null>> => {
  return await tryCatch(async () => {
    const updatedRecords = await db
      .update(records)
      .set(updates)
      .where(eq(records.id, id))
      .returning();

    return updatedRecords.length > 0 ? updatedRecords[0] : null;
  });
};

export const deleteRecord = async (
  db: DrizzleD1WithSchema,
  id: number,
): Promise<Result<boolean>> => {
  return await tryCatch(async () => {
    const result = await db.delete(records).where(eq(records.id, id));
    return result.meta.changes > 0;
  });
};
