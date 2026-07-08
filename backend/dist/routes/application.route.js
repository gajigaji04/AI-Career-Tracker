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
const applicationController = __importStar(require("../controllers/application.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const application_validation_1 = require("../validations/application.validation");
const router = (0, express_1.Router)();
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
router.post("/", auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(application_validation_1.createApplicationSchema), applicationController.createApplication);
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
router.get("/", auth_middleware_1.authenticate, applicationController.getApplications);
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
router.get("/:id", auth_middleware_1.authenticate, applicationController.getApplicationById);
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
router.patch("/:id", auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(application_validation_1.updateApplicationSchema), applicationController.updateApplication);
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
router.delete("/:id", auth_middleware_1.authenticate, applicationController.deleteApplication);
exports.default = router;
//# sourceMappingURL=application.route.js.map