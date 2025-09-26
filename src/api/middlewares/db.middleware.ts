import { drizzle } from "drizzle-orm/d1";
import { createMiddleware } from "hono/factory";
import {
  INTERNAL_SERVER_ERROR_CODE,
  INTERNAL_SERVER_ERROR_MESSAGE,
} from "http-stash";

import type { AppBindings } from "@/types";

import * as schema from "@/db/schema.drizzle";

export const dbMiddleware = () => {
  return createMiddleware<AppBindings>(async (c, next) => {
    try {
      c.set("drizzle", drizzle(c.env.DB, { schema }));

      await next();
      return;
    } catch {
      return c.json(
        {
          error: INTERNAL_SERVER_ERROR_MESSAGE,
          message: "Database connection failed",
        },
        INTERNAL_SERVER_ERROR_CODE,
      );
    }
  });
};
