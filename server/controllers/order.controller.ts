import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { IOrder } from "../models/order.Model";
import userModel from "../models/user.model";
import CourseModel, { ICourse } from "../models/course.model";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.Model";
import { redis } from "../utils/redis";
import { getAllOrdersService, newOrder } from "../services/order.service";
require("dotenv").config();

// create order
export const createOrder = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { courseId, payment_info } = req.body as IOrder;
        const user = await userModel.findById(req.user?._id);
        const courseExistInUser = user?.courses.some(
            (course: any) => course._id.toString() === courseId
          );
    
          if (courseExistInUser) {
            return next(
              new ErrorHandler("You have already purchased this course", 400)
            );
          }   
          const course = await CourseModel.findById(courseId);
          console.log(course);
          if (!course) {
            return next(new ErrorHandler("Course not found", 404));
          }
          //create order data.
          const data: any = {
            courseId: course._id,
            userId: user?._id,
            payment_info,
          };
          
          const mailData = {
            order: {
              _id: course._id.toString().slice(0, 6), //this will show only 0 to 6 item
              name: course.name,
              price: course.price,
              date: new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
            },
          };
          const html = await ejs.renderFile(
            path.join(__dirname, "../mails/order-confirmation.ejs"),
            { order: mailData }
          );
          try {
            if (user) {
              await sendMail({
                email: user.email,
                subject: "Order Confirmation",
                template: "order-confirmation.ejs",
                data: mailData,
              });
            }
          } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
          }
            
          user?.courses.push(course._id.toString());
          

        //   await redis.set(req.user?._id, JSON.stringify(user));
    
          await user?.save();
          await NotificationModel.create({
            user: user?._id,
            title: "New Order",
            message: `You have a new order from ${course?.name}`,
          });
          course.purchased = course.purchased + 1;      

          await course.save();
    
          newOrder(data,res,next);
} catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
})
// get All orders --- only for admin
export const getAllOrders = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrdersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);