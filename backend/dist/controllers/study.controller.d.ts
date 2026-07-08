import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
export declare const createStudy: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getStudies: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getStudyById: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateStudy: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteStudy: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=study.controller.d.ts.map