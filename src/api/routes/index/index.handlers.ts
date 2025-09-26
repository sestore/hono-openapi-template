import { OK_CODE } from "http-stash";

import type { AppRouteHandler } from "@/types";

import { APP_METADATA } from "@/config/app-metadata";
import { OPENAPI_CONFIG } from "@/config/open-api";

import type { GetIndexRoute } from "./index.routes";

export const getIndexHandler: AppRouteHandler<GetIndexRoute> = (c) => {
  return c.json(
    {
      name: APP_METADATA.NAME,
      version: APP_METADATA.VERSION,
      description: APP_METADATA.DESCRIPTION,
      docs: {
        openapi: OPENAPI_CONFIG.specPath,
        ui: "/docs",
      },
    },
    OK_CODE,
  );
};
