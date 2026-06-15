import { Router } from "express";
import * as applicationController from "../controllers/application.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createApplicationSchema,
  updateApplicationSchema,
} from "../validations/application.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: 취업 지원 관리 API
 */

/**
 * @swagger
 * /applications:
 *   post:
 *     summary: 지원 내역 생성
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyName
 *               - position
 *               - status
 *             properties:
 *               companyName:
 *                 type: string
 *                 example: 카카오
 *               position:
 *                 type: string
 *                 example: 백엔드 개발자
 *               status:
 *                 type: string
 *                 enum: [APPLIED, DOCUMENT_PASS, INTERVIEW, FINAL_PASS, REJECTED]
 *                 example: APPLIED
 *               appliedAt:
 *                 type: string
 *                 example: "2026-06-15"
 *               memo:
 *                 type: string
 *                 example: 서류 제출 완료
 *     responses:
 *       201:
 *         description: 생성 성공
 *       401:
 *         description: 인증 필요
 */
router.post(
  "/",
  authenticate,
  validate(createApplicationSchema),
  applicationController.createApplication,
);

/**
 * @swagger
 * /applications:
 *   get:
 *     summary: 지원 내역 목록 조회
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 지원 내역 목록 반환
 *       401:
 *         description: 인증 필요
 */
router.get("/", authenticate, applicationController.getApplications);

/**
 * @swagger
 * /applications/{id}:
 *   get:
 *     summary: 지원 내역 단건 조회
 *     tags: [Applications]
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
 *         description: 지원 내역 반환
 *       404:
 *         description: 존재하지 않음
 */
router.get("/:id", authenticate, applicationController.getApplicationById);

/**
 * @swagger
 * /applications/{id}:
 *   patch:
 *     summary: 지원 내역 수정
 *     tags: [Applications]
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
 *               companyName:
 *                 type: string
 *               position:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [APPLIED, DOCUMENT_PASS, INTERVIEW, FINAL_PASS, REJECTED]
 *               memo:
 *                 type: string
 *     responses:
 *       200:
 *         description: 수정 성공
 *       404:
 *         description: 존재하지 않음
 */
router.patch(
  "/:id",
  authenticate,
  validate(updateApplicationSchema),
  applicationController.updateApplication,
);

/**
 * @swagger
 * /applications/{id}:
 *   delete:
 *     summary: 지원 내역 삭제
 *     tags: [Applications]
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
router.delete("/:id", authenticate, applicationController.deleteApplication);

export default router;
