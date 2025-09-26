import { createRoute } from "@hono/zod-openapi";
import { OK_CODE } from "http-stash";

import { jsonContent } from "@/lib/openapi/utils/json-content.utils";

import { indexResponseOKSchema } from "./index.schema";

const tags = ["Index"];
const basePath = "/";

export const getIndexRoute = createRoute({
  tags,
  path: basePath,
  method: "get",
  responses: {
    [OK_CODE]: jsonContent(indexResponseOKSchema, "Index response"),
  },
});

export type GetIndexRoute = typeof getIndexRoute;
