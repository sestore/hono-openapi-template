import { createMiddleware } from "hono/factory";

export const faviconMiddleware = (emoji = "🌐") => {
  return createMiddleware(async (c, next) => {
    if (c.req.path === "/favicon.ico") {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" x="-0.1em" font-size="90">${emoji}</text></svg>`;

      c.header("Content-Type", "image/svg+xml");
      c.header("Cache-Control", "public, max-age=86400");

      return c.body(svg);
    }

    await next();
    return;
  });
};
