import type { AppOpenApi } from "@/types";

import { APP_METADATA } from "@/config/app-metadata";
import { OPENAPI_CONFIG } from "@/config/open-api";
/**
 * Register OpenAPI JSON specification endpoint
 */
export function registerOpenApiSpec(app: AppOpenApi) {
  app.doc(OPENAPI_CONFIG.specPath, {
    openapi: OPENAPI_CONFIG.specVersion,
    info: {
      title: APP_METADATA.NAME,
      description: APP_METADATA.DESCRIPTION,
      version: APP_METADATA.VERSION,
    },
  });
}
