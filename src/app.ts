import { authRouter } from "@/api/routes/auth/auth.main";
import { indexRouter } from "@/api/routes/index/index.main";
import { recordsRouter } from "@/api/routes/records/records.main";
import { createApplication } from "@/lib/factories/create-application";

const app = createApplication();

const apiRoutes = [indexRouter, recordsRouter, authRouter] as const;

apiRoutes.forEach((route) => app.route("/", route));

export type AppRouteType = (typeof apiRoutes)[number];

export default app;
