import { NextFunction, Request, Response } from "express";

export const catchAsyncError = (theFun: any) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(theFun(req, res, next)).catch(next);
}