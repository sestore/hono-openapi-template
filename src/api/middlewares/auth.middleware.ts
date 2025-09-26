import { createMiddleware } from "hono/factory";
import { jwt } from "hono/jwt";
import {
  FORBIDDEN_CODE,
  FORBIDDEN_MESSAGE,
  UNAUTHORIZED_CODE,
  UNAUTHORIZED_MESSAGE,
} from "http-stash";

import type { AppBindings } from "@/types";

import { getUserById } from "@/api/routes/auth/auth.services";
import { env } from "@/config/env";

export const authMiddleware = () => {
  return createMiddleware<AppBindings>(async (c, next) => {
    try {
      const jwtHandler = jwt({
        secret: env.JWT_SECRET,
      });

      //* Throws if JWT is invalid/missing/expired
      await jwtHandler(c, async () => {});

      const payload = c.get("jwtPayload");

      if (!payload?.sub) {
        return c.json(
          { error: true, message: UNAUTHORIZED_MESSAGE },
          UNAUTHORIZED_CODE,
        );
      }

      const db = c.get("drizzle");
      const userId = parseInt(payload.sub);

      if (isNaN(userId)) {
        return c.json(
          { error: true, message: UNAUTHORIZED_MESSAGE },
          UNAUTHORIZED_CODE,
        );
      }

      const { data: userData, error: userError } = await getUserById(
        db,
        userId,
      );

      if (userError) {
        return c.json(
          { error: true, message: UNAUTHORIZED_MESSAGE },
          UNAUTHORIZED_CODE,
        );
      }

      if (!userData) {
        return c.json(
          { error: true, message: FORBIDDEN_MESSAGE },
          FORBIDDEN_CODE,
        );
      }

      c.set("currentUser", userData);
      await next();
      return;
    } catch {
      return c.json(
        { error: true, message: UNAUTHORIZED_MESSAGE },
        UNAUTHORIZED_CODE,
      );
    }
  });
};
