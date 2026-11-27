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
import { logger } from "./config/logger";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

const app = express();

// CSP is already applied at the Nginx edge for the frontend; disabling it here avoids
// breaking Swagger UI's inline script at /api-docs while keeping helmet's other headers.
app.use(helmet({ contentSecurityPolicy: false }));

// ALLOWED_ORIGIN 은 콤마로 여러 개 지정 가능 (예: "https://a.com,http://localhost:5173")
const allowedOrigins = (process.env.ALLOWED_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    // 허용되지 않은 Origin 은 에러(500) 대신 CORS 헤더만 생략 → 브라우저가 차단
    origin: (origin, callback) => {
      callback(null, !origin || allowedOrigins.includes(origin));
    },
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
// 요청마다 고유 ID를 붙여서, 장애가 나면 그 요청 하나의 로그만 골라 추적할 수 있게 함.
app.use(
  pinoHttp({
    logger,
    autoLogging: { ignore: (req) => req.url === "/health" },
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

app.use(errorHandler);

export default app;
