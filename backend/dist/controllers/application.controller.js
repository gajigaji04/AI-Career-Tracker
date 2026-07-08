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
exports.deleteApplication = exports.updateApplication = exports.getApplicationById = exports.getApplications = exports.createApplication = void 0;
const applicationService = __importStar(require("../services/application.service"));
const createApplication = async (req, res) => {
    try {
        const application = await applicationService.createApplication(req.userId, req.body);
        res.status(201).json({
            success: true,
            data: application,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Unknown Error",
        });
    }
};
exports.createApplication = createApplication;
const getApplications = async (req, res) => {
    try {
        const applications = await applicationService.getApplications(req.userId);
        res.status(200).json({
            success: true,
            data: applications,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Unknown Error",
        });
    }
};
exports.getApplications = getApplications;
const getApplicationById = async (req, res) => {
    try {
        const id = req.params.id;
        const application = await applicationService.getApplicationById(id, req.userId);
        res.status(200).json({
            success: true,
            data: application,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : "Unknown Error",
        });
    }
};
exports.getApplicationById = getApplicationById;
const updateApplication = async (req, res) => {
    try {
        const id = req.params.id;
        const application = await applicationService.updateApplication(id, req.userId, req.body);
        res.status(200).json({
            success: true,
            data: application,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Unknown Error",
        });
    }
};
exports.updateApplication = updateApplication;
const deleteApplication = async (req, res) => {
    try {
        const id = req.params.id;
        await applicationService.deleteApplication(id, req.userId);
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
exports.deleteApplication = deleteApplication;
//# sourceMappingURL=application.controller.js.map