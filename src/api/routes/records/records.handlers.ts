import {
  CREATED_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  NO_CONTENT_CODE,
  NOT_FOUND_CODE,
  NOT_FOUND_MESSAGE,
  OK_CODE,
  UNPROCESSABLE_ENTITY_CODE,
} from "http-stash";

import type { AppRouteHandler } from "@/types";

import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/config/constants";

import type {
  CreateRecordRoute,
  DeleteRecordRoute,
  GetAllRecordsRoute,
  GetOneRecordRoute,
  UpdateRecordRoute,
} from "./records.routes";

import {
  createRecord,
  deleteRecord,
  getAllRecords,
  getRecordById,
  updateRecord,
} from "./records.services";

export const createRecordHandler: AppRouteHandler<CreateRecordRoute> = async (
  c,
) => {
  const recordData = c.req.valid("json");
  const db = c.get("drizzle");

  const { data: createdRecord, error } = await createRecord(db, recordData);

  if (error) {
    return c.json(
      {
        success: false,
        message: "Failed to create record",
      },
      INTERNAL_SERVER_ERROR_CODE,
    );
  }

  return c.json(createdRecord, CREATED_CODE);
};

export const getAllRecordsHandler: AppRouteHandler<GetAllRecordsRoute> = async (
  c,
) => {
  const db = c.get("drizzle");

  const { data: records, error } = await getAllRecords(db);

  if (error) {
    return c.json(
      {
        success: false,
        message: "Failed to fetch records",
      },
      INTERNAL_SERVER_ERROR_CODE,
    );
  }

  return c.json(records, OK_CODE);
};

export const getOneRecordHandler: AppRouteHandler<GetOneRecordRoute> = async (
  c,
) => {
  const { id } = c.req.valid("param");
  const db = c.get("drizzle");

  const { data: record, error } = await getRecordById(db, id);

  if (error) {
    return c.json(
      {
        success: false,
        message: "Failed to fetch record",
      },
      INTERNAL_SERVER_ERROR_CODE,
    );
  }

  if (!record) {
    return c.json({ message: NOT_FOUND_MESSAGE }, NOT_FOUND_CODE);
  }

  return c.json(record, OK_CODE);
};

export const updateRecordHandler: AppRouteHandler<UpdateRecordRoute> = async (
  c,
) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");
  const db = c.get("drizzle");

  if (!updates.text) {
    return c.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: ZOD_ERROR_CODES.INVALID_UPDATES,
              path: [],
              message: ZOD_ERROR_MESSAGES.NO_UPDATES,
            },
          ],
          name: "ZodError",
        },
      },
      UNPROCESSABLE_ENTITY_CODE,
    );
  }

  const { data: updatedRecord, error } = await updateRecord(db, id, updates);

  if (error) {
    return c.json(
      {
        success: false,
        message: "Failed to update record",
      },
      INTERNAL_SERVER_ERROR_CODE,
    );
  }

  if (!updatedRecord) {
    return c.json({ message: NOT_FOUND_MESSAGE }, NOT_FOUND_CODE);
  }

  return c.json(updatedRecord, OK_CODE);
};

export const deleteRecordHandler: AppRouteHandler<DeleteRecordRoute> = async (
  c,
) => {
  const { id } = c.req.valid("param");
  const db = c.get("drizzle");

  const { data: wasDeleted, error } = await deleteRecord(db, id);

  if (error) {
    return c.json(
      {
        success: false,
        message: "Failed to delete record",
      },
      INTERNAL_SERVER_ERROR_CODE,
    );
  }

  if (!wasDeleted) {
    return c.json({ message: NOT_FOUND_MESSAGE }, NOT_FOUND_CODE);
  }

  return c.body(null, NO_CONTENT_CODE);
};
