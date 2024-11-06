import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import { getNotifications} from "../controllers/notification.controller";
const notificationRoute = express.Router();

notificationRoute.get(
  "/get-all-notifications",
  isAutheticated,
  authorizeRoles("admin"),
  getNotifications
);
export default notificationRoute;