import { Router } from "express";
import * as studyController from "../controllers/study.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createStudySchema } from "../validations/study.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Studies
 *   description: 학습 기록 API
 */

/**
 * @swagger
 * /studies:
 *   post:
 *     summary: 학습 기록 생성
 *     tags: [Studies]
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
 *               - content
 *               - category
 *               - studyTime
 *               - studyDate
 *             properties:
 *               title:
 *                 type: string
 *                 example: TypeScript 기초
 *               content:
 *                 type: string
 *                 example: 타입 시스템 공부
 *               category:
 *                 type: string
 *                 example: 프로그래밍
 *               studyTime:
 *                 type: number
 *                 example: 120
 *               studyDate:
 *                 type: string
 *                 example: "2026-06-15"
 *     responses:
 *       201:
 *         description: 생성 성공
 *       401:
 *         description: 인증 필요
 */
router.post(
  "/",
  authenticate,
  validate(createStudySchema),
  studyController.createStudy,
);

/**
 * @swagger
 * /studies:
 *   get:
 *     summary: 학습 기록 목록 조회
 *     tags: [Studies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 학습 기록 목록 반환
 *       401:
 *         description: 인증 필요
 */
router.get("/", authenticate, studyController.getStudies);

/**
 * @swagger
 * /studies/{id}:
 *   get:
 *     summary: 학습 기록 단건 조회
 *     tags: [Studies]
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
 *         description: 학습 기록 반환
 *       404:
 *         description: 존재하지 않음
 */
router.get("/:id", authenticate, studyController.getStudyById);

/**
 * @swagger
 * /studies/{id}:
 *   patch:
 *     summary: 학습 기록 수정
 *     tags: [Studies]
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
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *               studyTime:
 *                 type: number
 *               studyDate:
 *                 type: string
 *     responses:
 *       200:
 *         description: 수정 성공
 *       404:
 *         description: 존재하지 않음
 */
router.patch("/:id", authenticate, studyController.updateStudy);

/**
 * @swagger
 * /studies/{id}:
 *   delete:
 *     summary: 학습 기록 삭제
 *     tags: [Studies]
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
router.delete("/:id", authenticate, studyController.deleteStudy);

export default router;
