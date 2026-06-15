import { Router } from "express";
import * as projectController from "../controllers/project.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createProjectSchema } from "../validations/project.validation";

const router = Router();

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
router.post(
  "/",
  authenticate,
  validate(createProjectSchema),
  projectController.createProject,
);

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
router.get("/", authenticate, projectController.getProjects);

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
router.get("/:id", authenticate, projectController.getProjectById);

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
router.patch("/:id", authenticate, projectController.updateProject);

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
router.delete("/:id", authenticate, projectController.deleteProject);

export default router;
