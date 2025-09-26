import { createOpenApiRouter } from "@/lib/factories/create-openapi-router";

import { getIndexHandler } from "./index.handlers";
import { getIndexRoute } from "./index.routes";

export const indexRouter = createOpenApiRouter().openapi(
  getIndexRoute,
  getIndexHandler,
);
