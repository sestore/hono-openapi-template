import type { ErrorHandler } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

import {
  INTERNAL_SERVER_ERROR_CODE,
  INTERNAL_SERVER_ERROR_MESSAGE,
} from "http-stash";

import { isProduction } from "@/config/constants";

type HasStatus = {
  status: number;
};

interface ErrorResponse {
  error: true;
  message: string;
  requestId?: string;
  stack?: string;
}

export const errorHandler = (): ErrorHandler => (err, c) => {
  const requestId = c.get("requestId");

  const hasStatus = (error: unknown): error is HasStatus =>
    typeof (error as HasStatus).status === "number";

  const statusCode: ContentfulStatusCode = hasStatus(err)
    ? (err.status as ContentfulStatusCode)
    : INTERNAL_SERVER_ERROR_CODE;

  const errorResponse: ErrorResponse = {
    error: true,
    message: err instanceof Error ? err.message : INTERNAL_SERVER_ERROR_MESSAGE,
  };

  if (requestId) {
    errorResponse.requestId = requestId;
  }

  if (!isProduction && err instanceof Error && err.stack) {
    errorResponse.stack = err.stack;
  }

  return c.json(errorResponse, statusCode);
};
