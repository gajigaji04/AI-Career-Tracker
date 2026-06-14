import express from "express";
import cors from "cors";

import authRouter from "./routes/auth.route";
import studyRouter from "./routes/study.route";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/studies", studyRouter);

export default app;
