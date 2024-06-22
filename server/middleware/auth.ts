// import { Request, Response, NextFunction } from "express";
// import { catchAsyncError } from "./catchAsyncError";
// import ErrorHandler from "../utils/ErrorHandler";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import { redis } from "../utils/redis";

// // authenticated user
// export const isAutheticated = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//   const access_token = req.cookies.access_token as string;
//     console.log(access_token);
//   if (!access_token) {
//     return next(new ErrorHandler("Please login to access this resource", 401));
//   }

//   try {
//     const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN as string) as JwtPayload;

//     if (!decoded) {
//       return next(new ErrorHandler("Access token is not valid", 401));
//     }

//     const user = await redis.get(decoded.id);

//     if (!user) {
//       return next(new ErrorHandler("User not found", 401));
//     }

//     req.user = JSON.parse(user) as any; // Assuming req.user is defined elsewhere

//     next();
//   } catch (error) {
//     return next(new ErrorHandler("Authentication failed", 401));
//   }
// });


import { Request, Response, NextFunction } from "express";
import { catchAsyncError } from "./catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";

// authenticated user
export const isAutheticated = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token as string;

    if (!access_token) {
      return next(
        new ErrorHandler("Please login to access this resource", 400)
      );
    }

    const decoded = jwt.decode(access_token) as JwtPayload;

    if (!decoded) {
      return next(new ErrorHandler("access token is not valid", 400));
    }

   
      const user = await redis.get(decoded.id);

      if (!user) {
        return next(
          new ErrorHandler("Please login to access this resource", 400)
        );
      }

      req.user = JSON.parse(user);

      next();
    
  }
);

// validate user role
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role: ${req.user?.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};



// import { Request, Response, NextFunction } from "express";
// import { catchAsyncError } from "./catchAsyncError";
// import ErrorHandler from "../utils/ErrorHandler";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import { redis } from "../utils/redis";

// // authenticated user
// export const isAutheticated = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//   const access_token = req.cookies.access_token as string;

//   if (!access_token) {
//     return next(new ErrorHandler("Please login to access this resource", 400));
//   }
//   const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN as string) as JwtPayload;

//   if (!decoded) {
//     return next(new ErrorHandler("Access token is not valid", 400));
//   }

//   const user = await redis.get(decoded.id);

//   if (!user) {
//     return next(new ErrorHandler("User not found", 400));
//   }

//   req.user = JSON.parse(user) as any;
//   next();
// });





// import { Request,Response,NextFunction } from "express";
// import { catchAsyncError } from "./catchAsyncError";
// import ErrorHandler from "../utils/ErrorHandler";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import { redis } from "../utils/redis";

// //authenticated user
// export const isAutheticated = catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
//   const access_token = req.cookies.access_token as string;
//   if(!access_token){
//     return next(new ErrorHandler("Please login to access the resource",400));
//   }  
// // compire with env access token to cookies access token
//   const decoded = jwt.verify(access_token,process.env.ACCESS_TOKEN as string) as JwtPayload;
//   if (!decoded){
//     return next(new ErrorHandler("access token is not valid",400));
//   }
//   const user = await redis.get(decoded.id);
//   if(!user){
//     return next(new ErrorHandler("user not found",400));
//   }
//   req.user=JSON.parse(user);
//   next();
// })



