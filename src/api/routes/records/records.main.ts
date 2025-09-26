import { createOpenApiRouter } from "@/lib/factories/create-openapi-router";

import {
  createRecordHandler,
  deleteRecordHandler,
  getAllRecordsHandler,
  getOneRecordHandler,
  updateRecordHandler,
} from "./records.handlers";
import {
  createRecordRoute,
  deleteRecordRoute,
  getAllRecordsRoute,
  getOneRecordRoute,
  updateRecordRoute,
} from "./records.routes";

export const recordsRouter = createOpenApiRouter()
  .openapi(getAllRecordsRoute, getAllRecordsHandler)
  .openapi(getOneRecordRoute, getOneRecordHandler)
  .openapi(createRecordRoute, createRecordHandler)
  .openapi(updateRecordRoute, updateRecordHandler)
  .openapi(deleteRecordRoute, deleteRecordHandler);
