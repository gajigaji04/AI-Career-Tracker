import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
export declare const createApplication: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getApplications: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getApplicationById: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateApplication: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteApplication: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=application.controller.d.ts.map