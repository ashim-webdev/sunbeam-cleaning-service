import express from "express";
import {
  createLeave,
  getAllLeaves,
  getMyLeaves,
  updateLeaveStatus,
  getLeavesByUser
} from "../controllers/leaveController.js";

import { protectRoute, isAdminRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protectRoute, createLeave);
router.get("/", protectRoute, isAdminRoute, getAllLeaves);
router.get("/my", protectRoute, getMyLeaves);
router.put("/:id", protectRoute, isAdminRoute, updateLeaveStatus);
router.get(
  "/user/:id",
  protectRoute,
  isAdminRoute,
  getLeavesByUser
);

export default router;