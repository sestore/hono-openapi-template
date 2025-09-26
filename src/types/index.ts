import type {
  OpenAPIHono,
  RouteConfig,
  RouteHandler,
  z,
} from "@hono/zod-openapi";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { Schema } from "hono";
import type { PinoLogger } from "hono-pino";

import type * as schema from "@/db/schema.drizzle";
import type { DrizzleZod_Users_Select } from "@/db/schema.types";

export type DrizzleD1WithSchema = DrizzleD1Database<typeof schema>;

export type AppBindings = {
  Bindings: {
    DB: D1Database;
  };
  Variables: {
    drizzle: DrizzleD1WithSchema;
    logger: PinoLogger;
    jwtPayload?: JWTPayload;
    currentUser?: DrizzleZod_Users_Select;
  };
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type AppOpenApi<S extends Schema = {}> = OpenAPIHono<AppBindings, S>;
export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>;

export type ZodSchema = z.ZodUnion | z.ZodObject | z.ZodArray<z.ZodObject>;
export type ZodIssue = z.core.$ZodIssue;

export type JWTPayload = {
  sub: string;
  phoneNumber: string;
  name: string;
  iat: number;
  exp: number;
};

export type RefreshTokenPayload = {
  sub: string;
  type: "refresh";
  iat: number;
  exp: number;
};

export type UserLogin = {
  phoneNumber: string;
  password: string;
};
