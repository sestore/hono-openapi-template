import { z } from "@hono/zod-openapi";

const userSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  phoneNumber: z.string().openapi({ example: "+1234567890" }),
  name: z.string().openapi({ example: "John Doe" }),
});

const successResponseSchema = z.object({
  success: z.boolean().openapi({ example: true }),
});

export const loginResponseOKSchema = successResponseSchema.extend({
  message: z.string().openapi({ example: "Login successful" }),
  accessToken: z.string().openapi({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  }),
  refreshToken: z.string().openapi({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  }),
  user: userSchema,
});

export const loginRequestBodySchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .max(15, "Phone number must not exceed 15 characters")
    .openapi({
      example: "1234567890",
      description: "Phone number in international format",
    }),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .openapi({
      example: "1234567890",
      description: "User password (minimum 6 characters)",
    }),
});

export const currentUserResponseOKSchema = successResponseSchema.extend({
  message: z
    .string()
    .openapi({ example: "User information retrieved successfully" }),
  user: userSchema,
});

export const refreshTokenRequestBodySchema = z.object({
  refreshToken: z.string().openapi({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    description: "Valid refresh token",
  }),
});

export const refreshTokenResponseOKSchema = successResponseSchema.extend({
  message: z.string().openapi({ example: "Token refreshed successfully" }),
  accessToken: z.string().openapi({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  }),
  refreshToken: z.string().openapi({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  }),
});
