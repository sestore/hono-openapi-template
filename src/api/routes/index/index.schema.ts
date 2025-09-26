import { z } from "@hono/zod-openapi";

import { APP_METADATA } from "@/config/app-metadata";
import { OPENAPI_CONFIG } from "@/config/open-api";

export const indexResponseOKSchema = z.object({
  name: z.string().openapi({ example: APP_METADATA.NAME }),
  version: z.string().openapi({ example: APP_METADATA.VERSION }),
  description: z.string().openapi({ example: APP_METADATA.DESCRIPTION }),
  docs: z.object({
    openapi: z.string().openapi({ example: OPENAPI_CONFIG.specPath }),
    ui: z.string().openapi({ example: "/docs" }),
  }),
});
