import { OpenAPIHono } from "@hono/zod-openapi";

import type { AppBindings } from "@/types";

import { openApiValidationHook } from "@/lib/openapi/utils/validation-hook.utils";

/**
 * Creates an OpenAPI-enabled Hono router with app defaults.
 * - Zod validation for requests/responses
 * - Auto OpenAPI docs
 */
export function createOpenApiRouter() {
  return new OpenAPIHono<AppBindings>({
    /** Route matching: `/hello` ≠ `/hello/` if strict, relaxed improves DX */
    strict: false,

    /** Default post-validation hook: returns 422 JSON on error, can override per route */
    defaultHook: openApiValidationHook,
  });
}
