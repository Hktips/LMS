import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
export const ErrorMiddleware = (
    err: any, 
    req: Request, 
    res: Response,
    next: NextFunction
) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'internal server error';
    if (err.name == 'CastError') {
        const message = 'Resource not found Invalated: ${err.path}';
        err = new ErrorHandler(message, 400);
    }
    if (err.code === 11000) {
        const message = 'Duplicate ${Object.keys(err.keyValue)} entered';
        err = new ErrorHandler(message, 400)
    }
    if (err.name = 'jsonWebTokenError') {
        const message = 'json web token is invalled, try again ';
        err = new ErrorHandler(message, 400);
    }
    if (err.name == 'TokenExpireError') {
        const message = 'json web token is expired, try again';
        err = new ErrorHandler(message, 400);
    }
    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}