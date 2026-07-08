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
const studyController = __importStar(require("../controllers/study.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const study_validation_1 = require("../validations/study.validation");
const router = (0, express_1.Router)();
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
router.post("/", auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(study_validation_1.createStudySchema), studyController.createStudy);
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
router.get("/", auth_middleware_1.authenticate, studyController.getStudies);
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
router.get("/:id", auth_middleware_1.authenticate, studyController.getStudyById);
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
router.patch("/:id", auth_middleware_1.authenticate, studyController.updateStudy);
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
router.delete("/:id", auth_middleware_1.authenticate, studyController.deleteStudy);
exports.default = router;
//# sourceMappingURL=study.route.js.map