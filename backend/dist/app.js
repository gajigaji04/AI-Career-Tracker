"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const study_route_1 = __importDefault(require("./routes/study.route"));
const project_route_1 = __importDefault(require("./routes/project.route"));
const application_route_1 = __importDefault(require("./routes/application.route"));
const dashboard_route_1 = __importDefault(require("./routes/dashboard.route"));
const ai_route_1 = __importDefault(require("./routes/ai.route"));
const resume_route_1 = __importDefault(require("./routes/resume.route"));
const error_middleware_1 = require("./middlewares/error.middleware");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: "http://localhost:5173", credentials: true }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use("/auth", auth_route_1.default);
app.use("/studies", study_route_1.default);
app.use("/projects", project_route_1.default);
app.use("/applications", application_route_1.default);
app.use("/dashboard", dashboard_route_1.default);
app.use("/ai", ai_route_1.default);
app.use("/resumes", resume_route_1.default);
app.use(error_middleware_1.errorHandler);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
app.get("/", (req, res) => {
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
exports.default = app;
//# sourceMappingURL=app.js.map