import app from "./app";
import { logger } from "./config/logger";

const port = 3000;

app.listen(port, () => {
  logger.info(`server start http://localhost:${port}`);
});
