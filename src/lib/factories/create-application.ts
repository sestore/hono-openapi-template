import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";

import { notFoundHandler } from "@/api/middlewares/404.middleware";
import { dbMiddleware } from "@/api/middlewares/db.middleware";
import { errorHandler } from "@/api/middlewares/error.middleware";
import { faviconMiddleware } from "@/api/middlewares/favicon.middleware";
import { loggerMiddleware } from "@/api/middlewares/logger.middleware";
import { isProduction } from "@/config/constants";
import { createOpenApiRouter } from "@/lib/factories/create-openapi-router";
import { registerOpenApiSpec } from "@/lib/integrations/register-openapi-spec";
import { registerScalarUI } from "@/lib/integrations/register-scalar-ui";

/**
 * Creates Hono application with middleware, error handling, and API docs.
 *
 * @returns Configured Hono application instance
 */
export function createApplication() {
  const app = createOpenApiRouter();

  // Global middlewares
  app
    .use(
      cors({
        origin: isProduction
          ? "http://placeholder.com"
          : "http://localhost:8787",
        allowMethods: ["GET", "POST", "DELETE", "PATCH"],
        allowHeaders: ["Content-Type", "Authorization"],
        maxAge: 86400,
      }),
    )
    .use(secureHeaders())
    .use(requestId())
    .use(faviconMiddleware())
    .use(loggerMiddleware())
    .use(dbMiddleware())

    // Error & 404 handlers
    .onError(errorHandler())
    .notFound(notFoundHandler());

  // Register API docs
  registerOpenApiSpec(app);
  registerScalarUI(app);

  return app;
}
