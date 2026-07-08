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
exports.deleteStudy = exports.updateStudy = exports.getStudyById = exports.getStudies = exports.createStudy = void 0;
const studyService = __importStar(require("../services/study.service"));
const createStudy = async (req, res) => {
    try {
        const study = await studyService.createStudy(req.userId, req.body);
        res.status(201).json({
            success: true,
            data: study,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Unknown Error",
        });
    }
};
exports.createStudy = createStudy;
const getStudies = async (req, res) => {
    try {
        const studies = await studyService.getStudies(req.userId);
        res.status(200).json({
            success: true,
            data: studies,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Unknown Error",
        });
    }
};
exports.getStudies = getStudies;
const getStudyById = async (req, res) => {
    try {
        const id = req.params.id;
        const study = await studyService.getStudyById(id, req.userId);
        res.status(200).json({
            success: true,
            data: study,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : "Unknown Error",
        });
    }
};
exports.getStudyById = getStudyById;
const updateStudy = async (req, res) => {
    try {
        const id = req.params.id;
        const study = await studyService.updateStudy(id, req.userId, req.body);
        res.status(200).json({
            success: true,
            data: study,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Unknown Error",
        });
    }
};
exports.updateStudy = updateStudy;
const deleteStudy = async (req, res) => {
    try {
        const id = req.params.id;
        await studyService.deleteStudy(id, req.userId);
        res.status(200).json({
            success: true,
            message: "삭제 완료",
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Unknown Error",
        });
    }
};
exports.deleteStudy = deleteStudy;
//# sourceMappingURL=study.controller.js.map