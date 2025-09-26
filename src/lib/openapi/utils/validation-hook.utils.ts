import type { Hook } from "@hono/zod-openapi";

import { UNPROCESSABLE_ENTITY_CODE } from "http-stash";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const openApiValidationHook: Hook<any, any, any, any> = (result, c) => {
  if (!result.success) {
    return c.json(
      {
        success: result.success,
        error: {
          name: result.error.name,
          issues: result.error.issues,
        },
      },
      UNPROCESSABLE_ENTITY_CODE,
    );
  }
};
