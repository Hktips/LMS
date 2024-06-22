import express from "express";
import { activateUser, loginUser,logoutUser , registrationonUser } from "../controllers/user.controller";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
const userRouter = express.Router();

userRouter.post('/registration', registrationonUser);
userRouter.post('/activate-user',activateUser);
userRouter.post('/login',loginUser);
userRouter.get('/logout',isAutheticated,authorizeRoles("admin"),logoutUser);

export default userRouter;