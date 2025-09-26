import { Scalar } from "@scalar/hono-api-reference";

import type { AppOpenApi } from "@/types";

import { OPENAPI_CONFIG } from "@/config/open-api";

/**
 * Register documentation UI endpoint
 */
export function registerScalarUI(app: AppOpenApi) {
  app.get(
    "/docs",
    Scalar({
      url: OPENAPI_CONFIG.specPath,
      layout: "classic",
      theme: "kepler",
      defaultHttpClient: {
        targetKey: "js",
        clientKey: "fetch",
      },
    }),
  );
}
