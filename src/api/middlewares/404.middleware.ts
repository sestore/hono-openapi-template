import type { NotFoundHandler } from "hono";

import { NOT_FOUND_CODE, NOT_FOUND_MESSAGE } from "http-stash";

export const notFoundHandler = (): NotFoundHandler => {
  return (c) => {
    const message = `${NOT_FOUND_MESSAGE} - ${c.req.path}`;

    return c.json(
      {
        error: true,
        message,
        path: c.req.path,
        method: c.req.method,
      },
      NOT_FOUND_CODE,
    );
  };
};
