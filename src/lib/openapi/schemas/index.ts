import { z } from "@hono/zod-openapi";
import { NOT_FOUND_MESSAGE } from "http-stash";

export const idParamsSchema = z.object({
  id: z.coerce.number().openapi({
    param: {
      name: "id",
      in: "path",
      required: true,
    },
    required: ["id"],
    example: 1,
  }),
});

export const authorizationHeaderSchema = z.object({
  Authorization: z
    .string()
    .regex(/^Bearer\s.+/)
    .openapi({
      description: "Bearer token for authentication",
      example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    }),
});

export const notFoundSchema = z
  .object({
    message: z.string(),
  })
  .openapi({
    example: {
      NOT_FOUND_MESSAGE,
    },
  });

export const internalServerErrorSchema = z
  .object({
    success: z.boolean(),
    message: z.string(),
  })
  .openapi({
    example: {
      success: false,
      message: "Internal server error occurred",
    },
  });

export const unauthorizedSchema = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: "Invalid credentials" }),
});

export const notAuthenticatedSchema = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: "Authentication token required" }),
});
