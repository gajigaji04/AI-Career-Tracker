import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import pinoHttp from "pino-http";

import authRouter from "./routes/auth.route";
import studyRouter from "./routes/study.route";
import projectRouter from "./routes/project.route";
import applicationRouter from "./routes/application.route";
import dashboardRouter from "./routes/dashboard.route";
import aiRouter from "./routes/ai.route";
import resumeRouter from "./routes/resume.route";

import { errorHandler } from "./middlewares/error.middleware";
import { prisma } from "./prisma/prisma";
// import { logger } from "./config/logger";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

const app = express();

// CSP is already applied at the Nginx edge for the frontend; disabling it here avoids
// breaking Swagger UI's inline script at /api-docs while keeping helmet's other headers.
const allowedOrigins = (process.env.ALLOWED_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
  }),
);

app.use("/auth", authRouter);
app.use("/studies", studyRouter);
app.use("/projects", projectRouter);
app.use("/applications", applicationRouter);
app.use("/dashboard", dashboardRouter);
app.use("/ai", aiRouter);
app.use("/resumes", resumeRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: "ok", db: "connected" });
  } catch {
    res.status(503).json({ status: "error", db: "disconnected" });
  }
});

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

app.use(errorHandler);

export default app;
