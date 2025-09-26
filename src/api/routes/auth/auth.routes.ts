import { createRoute } from "@hono/zod-openapi";
import {
  INTERNAL_SERVER_ERROR_CODE,
  OK_CODE,
  UNAUTHORIZED_CODE,
  UNPROCESSABLE_ENTITY_CODE,
} from "http-stash";

import { authMiddleware } from "@/api/middlewares/auth.middleware";
import {
  authorizationHeaderSchema,
  internalServerErrorSchema,
  notAuthenticatedSchema,
  unauthorizedSchema,
} from "@/lib/openapi/schemas";
import { createErrorSchema } from "@/lib/openapi/utils/create-error-schema.utils";
import {
  jsonContent,
  jsonContentRequired,
} from "@/lib/openapi/utils/json-content.utils";

import {
  currentUserResponseOKSchema,
  loginRequestBodySchema,
  loginResponseOKSchema,
  refreshTokenRequestBodySchema,
  refreshTokenResponseOKSchema,
} from "./auth.schema";

const basePath = "/auth";
const tags = ["Authentication"];

export const loginRoute = createRoute({
  tags,
  path: `${basePath}/login`,
  method: "post",
  summary: "User login",
  description: "Authenticate user with phone number and password",
  request: {
    body: jsonContentRequired(loginRequestBodySchema, "User login credentials"),
  },
  responses: {
    [OK_CODE]: jsonContent(loginResponseOKSchema, "Login successful"),
    [UNAUTHORIZED_CODE]: jsonContent(unauthorizedSchema, "Invalid credentials"),
    [UNPROCESSABLE_ENTITY_CODE]: jsonContent(
      createErrorSchema(loginRequestBodySchema),
      "Validation error(s)",
    ),
    [INTERNAL_SERVER_ERROR_CODE]: jsonContent(
      internalServerErrorSchema,
      "Authentication service unavailable",
    ),
  },
});

export const currentUserRoute = createRoute({
  tags,
  path: `${basePath}/current-user`,
  method: "get",
  summary: "Get current user",
  description: "Retrieve information about the currently authenticated user",
  middleware: authMiddleware(),
  request: {
    headers: authorizationHeaderSchema,
  },
  responses: {
    [OK_CODE]: jsonContent(
      currentUserResponseOKSchema,
      "Current user information",
    ),
    [UNAUTHORIZED_CODE]: jsonContent(
      notAuthenticatedSchema,
      "Not authenticated",
    ),
  },
});

export const refreshTokenRoute = createRoute({
  tags,
  path: `${basePath}/refresh`,
  method: "post",
  summary: "Refresh access token",
  description: "Generate new access token using refresh token",
  request: {
    body: jsonContentRequired(refreshTokenRequestBodySchema, "Refresh token"),
  },
  responses: {
    [OK_CODE]: jsonContent(
      refreshTokenResponseOKSchema,
      "Token refreshed successfully",
    ),
    [UNAUTHORIZED_CODE]: jsonContent(
      unauthorizedSchema,
      "Invalid or expired refresh token",
    ),
    [UNPROCESSABLE_ENTITY_CODE]: jsonContent(
      createErrorSchema(refreshTokenRequestBodySchema),
      "Validation error(s)",
    ),
    [INTERNAL_SERVER_ERROR_CODE]: jsonContent(
      internalServerErrorSchema,
      "Token refresh service unavailable",
    ),
  },
});

export type LoginRoute = typeof loginRoute;
export type CurrentUserRoute = typeof currentUserRoute;
export type RefreshTokenRoute = typeof refreshTokenRoute;
