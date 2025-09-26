import { createOpenApiRouter } from "@/lib/factories/create-openapi-router";

import {
  currentUserHandler,
  loginHandler,
  refreshTokenHandler,
} from "./auth.handlers";
import { currentUserRoute, loginRoute, refreshTokenRoute } from "./auth.routes";

export const authRouter = createOpenApiRouter()
  .openapi(loginRoute, loginHandler)
  .openapi(currentUserRoute, currentUserHandler)
  .openapi(refreshTokenRoute, refreshTokenHandler);
