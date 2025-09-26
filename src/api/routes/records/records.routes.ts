import { createRoute, z } from "@hono/zod-openapi";
import {
  CREATED_CODE,
  FORBIDDEN_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  NO_CONTENT_CODE,
  NOT_FOUND_CODE,
  OK_CODE,
  UNAUTHORIZED_CODE,
  UNPROCESSABLE_ENTITY_CODE,
} from "http-stash";

import { authMiddleware } from "@/api/middlewares/auth.middleware";
import { drizzleZodRecordsSchema } from "@/db/schema.zod";
import {
  authorizationHeaderSchema,
  idParamsSchema,
  internalServerErrorSchema,
  notAuthenticatedSchema,
  notFoundSchema,
  unauthorizedSchema,
} from "@/lib/openapi/schemas";
import { createErrorSchema } from "@/lib/openapi/utils/create-error-schema.utils";
import {
  jsonContent,
  jsonContentRequired,
} from "@/lib/openapi/utils/json-content.utils";

const basePath = "/records";
const tags = ["Records"];

export const createRecordRoute = createRoute({
  tags,
  path: basePath,
  method: "post",
  summary: "Create a new record",
  description: "Authenticated users can create a new record.",
  middleware: authMiddleware(),
  request: {
    headers: authorizationHeaderSchema,
    body: jsonContentRequired(
      drizzleZodRecordsSchema.insert,
      "The record to create",
    ),
  },
  responses: {
    [CREATED_CODE]: jsonContent(
      drizzleZodRecordsSchema.select,
      "The created record",
    ),
    [UNPROCESSABLE_ENTITY_CODE]: jsonContent(
      createErrorSchema(drizzleZodRecordsSchema.insert),
      "The validation error(s)",
    ),
    [INTERNAL_SERVER_ERROR_CODE]: jsonContent(
      internalServerErrorSchema,
      "Failed to create record",
    ),
    [UNAUTHORIZED_CODE]: jsonContent(
      notAuthenticatedSchema,
      "Missing or invalid authentication",
    ),
    [FORBIDDEN_CODE]: jsonContent(
      unauthorizedSchema,
      "Authenticated but not allowed to access this resource",
    ),
  },
});

export const getAllRecordsRoute = createRoute({
  tags,
  path: basePath,
  method: "get",
  summary: "Get all records",
  description: "Retrieve a list of all records in the system.",
  responses: {
    [OK_CODE]: jsonContent(
      z.array(drizzleZodRecordsSchema.select),
      "The list of records",
    ),
    [INTERNAL_SERVER_ERROR_CODE]: jsonContent(
      internalServerErrorSchema,
      "Failed to fetch records",
    ),
  },
});

export const getOneRecordRoute = createRoute({
  tags,
  path: `${basePath}/{id}`,
  method: "get",
  summary: "Get a specific record",
  description: "Retrieve a record by its unique ID.",
  request: {
    params: idParamsSchema,
  },
  responses: {
    [OK_CODE]: jsonContent(
      drizzleZodRecordsSchema.select,
      "The requested record",
    ),
    [NOT_FOUND_CODE]: jsonContent(notFoundSchema, "Record not found"),
    [UNPROCESSABLE_ENTITY_CODE]: jsonContent(
      createErrorSchema(idParamsSchema),
      "Invalid id error",
    ),
    [INTERNAL_SERVER_ERROR_CODE]: jsonContent(
      internalServerErrorSchema,
      "Failed to fetch record",
    ),
  },
});

export const updateRecordRoute = createRoute({
  tags,
  path: `${basePath}/{id}`,
  method: "patch",
  summary: "Update a record",
  description: "Authenticated users can update a record by its unique ID.",
  middleware: authMiddleware(),
  request: {
    headers: authorizationHeaderSchema,
    params: idParamsSchema,
    body: jsonContentRequired(
      drizzleZodRecordsSchema.insert,
      "The record updates",
    ),
  },
  responses: {
    [OK_CODE]: jsonContent(
      drizzleZodRecordsSchema.select,
      "The updated record",
    ),
    [NOT_FOUND_CODE]: jsonContent(notFoundSchema, "Record not found"),
    [UNPROCESSABLE_ENTITY_CODE]: jsonContent(
      createErrorSchema(drizzleZodRecordsSchema.insert).or(
        createErrorSchema(idParamsSchema),
      ),
      "The validation error(s)",
    ),
    [INTERNAL_SERVER_ERROR_CODE]: jsonContent(
      internalServerErrorSchema,
      "Failed to update record",
    ),
    [UNAUTHORIZED_CODE]: jsonContent(
      notAuthenticatedSchema,
      "Missing or invalid authentication",
    ),
    [FORBIDDEN_CODE]: jsonContent(
      unauthorizedSchema,
      "Authenticated but not allowed to access this resource",
    ),
  },
});

export const deleteRecordRoute = createRoute({
  tags,
  path: `${basePath}/{id}`,
  method: "delete",
  summary: "Delete a record",
  description: "Authenticated users can delete a record by its unique ID.",
  middleware: authMiddleware(),
  request: {
    headers: authorizationHeaderSchema,
    params: idParamsSchema,
  },
  responses: {
    [NO_CONTENT_CODE]: {
      description: "Record deleted",
    },
    [NOT_FOUND_CODE]: jsonContent(notFoundSchema, "Record not found"),
    [UNPROCESSABLE_ENTITY_CODE]: jsonContent(
      createErrorSchema(idParamsSchema),
      "Invalid id error",
    ),
    [INTERNAL_SERVER_ERROR_CODE]: jsonContent(
      internalServerErrorSchema,
      "Failed to delete record",
    ),
    [UNAUTHORIZED_CODE]: jsonContent(
      notAuthenticatedSchema,
      "Missing or invalid authentication",
    ),
    [FORBIDDEN_CODE]: jsonContent(
      unauthorizedSchema,
      "Authenticated but not allowed to access this resource",
    ),
  },
});

export type CreateRecordRoute = typeof createRecordRoute;
export type GetAllRecordsRoute = typeof getAllRecordsRoute;
export type GetOneRecordRoute = typeof getOneRecordRoute;
export type UpdateRecordRoute = typeof updateRecordRoute;
export type DeleteRecordRoute = typeof deleteRecordRoute;
