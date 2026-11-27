import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        errors: result.error.flatten(),
      });
    }

    // 원본 body 대신 Zod 가 검증·정제한 값만 다음 단계로 전달 (스키마에 없는 키 제거)
    req.body = result.data;
    next();
  };
