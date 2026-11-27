// 반드시 첫 import — 이후 모듈(Groq 클라이언트 등)이 로드 시점에 환경 변수를 읽기 때문.
// 그동안은 Prisma 6 Client 가 부수효과로 .env 를 읽어줘서 동작했지만 Prisma 7 에서 제거됨.
// 운영(Docker)은 compose env_file 로 주입되고 이미지에 .env 가 없으므로 영향 없음.
import "dotenv/config";
import app from "./app";
import { logger } from "./config/logger";

const port = 3000;

app.listen(port, () => {
  logger.info(`server start http://localhost:${port}`);
});
