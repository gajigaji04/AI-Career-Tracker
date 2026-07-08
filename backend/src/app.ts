import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.route";
import studyRouter from "./routes/study.route";
import projectRouter from "./routes/project.route";
import applicationRouter from "./routes/application.route";
import dashboardRouter from "./routes/dashboard.route";
import aiRouter from "./routes/ai.route";
import resumeRouter from "./routes/resume.route";

import { errorHandler } from "./middlewares/error.middleware";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

const app = express();

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN ?? "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/studies", studyRouter);
app.use("/projects", projectRouter);
app.use("/applications", applicationRouter);
app.use("/dashboard", dashboardRouter);
app.use("/ai", aiRouter);
app.use("/resumes", resumeRouter);

app.use(errorHandler);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (_req, res) => {
  res.send(`
    <h1>✅ 백엔드 실행 중</h1>
    <p>
      프론트엔드 접속:
      <a href="http://localhost:5173/applications">
        http://localhost:5173/applications
      </a>
    </p>
  `);
});

export default app;
