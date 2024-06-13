import express from "express";
import { activateUser, loginUser, registrationonUser } from "../controllers/user.controller";
const userRouter = express.Router();

userRouter.post('/registration', registrationonUser);
userRouter.post('/activate-user',activateUser);
userRouter.post('/login',loginUser);

export default userRouter;