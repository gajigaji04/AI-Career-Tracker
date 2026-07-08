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
exports.deleteProject = exports.updateProject = exports.getProjectById = exports.getProjects = exports.createProject = void 0;
const projectService = __importStar(require("../services/project.service"));
const createProject = async (req, res) => {
    try {
        const project = await projectService.createProject(req.userId, req.body);
        res.status(201).json({
            success: true,
            data: project,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Unknown Error",
        });
    }
};
exports.createProject = createProject;
const getProjects = async (req, res) => {
    try {
        const projects = await projectService.getProjects(req.userId);
        res.status(200).json({
            success: true,
            data: projects,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Unknown Error",
        });
    }
};
exports.getProjects = getProjects;
const getProjectById = async (req, res) => {
    try {
        const id = req.params.id;
        const project = await projectService.getProjectById(id, req.userId);
        res.status(200).json({
            success: true,
            data: project,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : "Unknown Error",
        });
    }
};
exports.getProjectById = getProjectById;
const updateProject = async (req, res) => {
    try {
        const id = req.params.id;
        const project = await projectService.updateProject(id, req.userId, req.body);
        res.status(200).json({
            success: true,
            data: project,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Unknown Error",
        });
    }
};
exports.updateProject = updateProject;
const deleteProject = async (req, res) => {
    try {
        const id = req.params.id;
        await projectService.deleteProject(id, req.userId);
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
exports.deleteProject = deleteProject;
//# sourceMappingURL=project.controller.js.map