import express from "express";
import cors from "cors";

import authRouter from "./routes/auth.route";
import studyRouter from "./routes/study.route";
import projectRouter from "./routes/project.route";
import applicationRouter from "./routes/application.route";
import dashboardRouter from "./routes/dashboard.route";

import { errorHandler } from "./middlewares/error.middleware";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/studies", studyRouter);
app.use("/projects", projectRouter);
app.use("/applications", applicationRouter);
app.use("/dashboard", dashboardRouter);

app.use(errorHandler);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
