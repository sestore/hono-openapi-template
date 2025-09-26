import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("production"),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),
  CLOUDFLARE_ACCOUNT_ID: z.string().optional(),
  CLOUDFLARE_D1_TOKEN: z.string().optional(),
  JWT_SECRET: z.string().min(32, "JWT secret must be at least 32 characters"),
});

export const env = envSchema.parse(process.env);
