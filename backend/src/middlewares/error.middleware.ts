// import { Request, Response, NextFunction } from "express";
// import { AppError } from "../errors/AppError";

// export const errorHandler = (
//   error: Error,
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   if (error instanceof AppError) {
//     return res.status(error.statusCode).json({
//       success: false,
//       message: error.message,
//     });
//   }

//   req.log.error({ err: error }, "unhandled error");

//   return res.status(500).json({
//     success: false,
//     message: "Internal Server Error",
//   });
// };
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error("🔥 ERROR:", err);

  res.status(500).json({
    message: "Internal Server Error",
  });
};
