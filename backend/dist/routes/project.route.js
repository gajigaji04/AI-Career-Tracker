"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projectController = __importStar(require("../controllers/project.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const project_validation_1 = require("../validations/project.validation");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: 프로젝트 관리 API
 */
/**
 * @swagger
 * /projects:
 *   post:
 *     summary: 프로젝트 생성
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - techStack
 *             properties:
 *               title:
 *                 type: string
 *                 example: AI CareerHub
 *               description:
 *                 type: string
 *                 example: AI 기반 취업 관리 플랫폼
 *               githubUrl:
 *                 type: string
 *                 example: https://github.com/user/repo
 *               deployUrl:
 *                 type: string
 *                 example: https://myapp.vercel.app
 *               techStack:
 *                 type: string
 *                 example: TypeScript, Node.js, Prisma
 *     responses:
 *       201:
 *         description: 생성 성공
 *       401:
 *         description: 인증 필요
 */
router.post("/", auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(project_validation_1.createProjectSchema), projectController.createProject);
/**
 * @swagger
 * /projects:
 *   get:
 *     summary: 프로젝트 목록 조회
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 프로젝트 목록 반환
 *       401:
 *         description: 인증 필요
 */
router.get("/", auth_middleware_1.authenticate, projectController.getProjects);
/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: 프로젝트 단건 조회
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 프로젝트 반환
 *       404:
 *         description: 존재하지 않음
 */
router.get("/:id", auth_middleware_1.authenticate, projectController.getProjectById);
/**
 * @swagger
 * /projects/{id}:
 *   patch:
 *     summary: 프로젝트 수정
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               githubUrl:
 *                 type: string
 *               deployUrl:
 *                 type: string
 *               techStack:
 *                 type: string
 *     responses:
 *       200:
 *         description: 수정 성공
 *       404:
 *         description: 존재하지 않음
 */
router.patch("/:id", auth_middleware_1.authenticate, projectController.updateProject);
/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: 프로젝트 삭제
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 삭제 성공
 *       404:
 *         description: 존재하지 않음
 */
router.delete("/:id", auth_middleware_1.authenticate, projectController.deleteProject);
exports.default = router;
//# sourceMappingURL=project.route.js.map