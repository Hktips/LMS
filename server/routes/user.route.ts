import express from "express";
import { activateUser, registrationonUser } from "../controllers/user.controller";
const userRouter = express.Router();

userRouter.post('/registration', registrationonUser);
userRouter.post('/activate-user',activateUser);

export default userRouter;