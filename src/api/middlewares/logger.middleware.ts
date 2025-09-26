import { pinoLogger } from "hono-pino";
import pino from "pino";

import { isDevelopment } from "@/config/constants";
import { env } from "@/config/env";

export function loggerMiddleware() {
  const loggerInstance = pino({
    level: env.LOG_LEVEL,
    ...(isDevelopment && {
      transport: {
        target: "pino/file",
        options: {
          destination: 1,
        },
      },
    }),
  });

  return pinoLogger({
    pino: loggerInstance,
  });
}
