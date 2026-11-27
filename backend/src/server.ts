// 반드시 첫 import — 이후 모듈(Groq 클라이언트 등)이 로드 시점에 환경 변수를 읽기 때문.
// 그동안은 Prisma 6 Client 가 부수효과로 .env 를 읽어줘서 동작했지만 Prisma 7 에서 제거됨.
// 운영(Docker)은 compose env_file 로 주입되고 이미지에 .env 가 없으므로 영향 없음.
import "dotenv/config";
import app from "./app";
import { logger } from "./config/logger";
import { prisma } from "./prisma/prisma";

const port = Number(process.env.PORT) || 3000;
// docker stop 은 SIGTERM 후 10초 뒤 SIGKILL — 그 전에 스스로 종료되도록 여유를 둔다
const SHUTDOWN_TIMEOUT_MS = 8_000;

const server = app.listen(port, () => {
  logger.info(`server start http://localhost:${port}`);
});

let shuttingDown = false;

// 배포·재시작 시 새 요청은 받지 않고, 처리 중인 요청을 마친 뒤 DB 연결을 정리하고 종료
const shutdown = (signal: string) => {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info({ signal }, "shutdown started");

  const forceExit = setTimeout(() => {
    logger.error("shutdown timed out — forcing exit");
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);
  forceExit.unref();

  server.close(async (err) => {
    try {
      await prisma.$disconnect();
    } finally {
      logger.info("shutdown complete");
      process.exit(err ? 1 : 0);
    }
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
