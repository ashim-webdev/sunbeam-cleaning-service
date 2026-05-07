import express from "express";
import {
  createSubTask,
  createTask,
  dashboardStatistics,
  deleteRestoreTask,
  duplicateTask,
  getTask,
  getTasks,
  postTaskActivity,
  trashTask,
  updateSubTaskStage,
  updateTask,
  updateTaskStage,
} from "../controllers/taskController.js";
import { isAdminRoute, protectRoute } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";


const router = express.Router();

router.post("/create", protectRoute, isAdminRoute, upload.array("assets", 10), createTask);
router.post("/duplicate/:id", protectRoute, isAdminRoute, duplicateTask);
router.post("/activity/:id", protectRoute, postTaskActivity);

router.get("/dashboard", protectRoute, dashboardStatistics);
router.get("/", protectRoute, getTasks);
router.get("/:id", protectRoute, getTask);

router.put("/create-subtask/:id", protectRoute, isAdminRoute, createSubTask);
router.put("/update/:id", protectRoute, isAdminRoute, upload.array("assets", 10), updateTask);
router.put("/change-stage/:id", protectRoute, updateTaskStage);
router.put(
  "/change-status/:taskId/:subTaskId",
  protectRoute,
  updateSubTaskStage
);
router.put("/:id", protectRoute, isAdminRoute, trashTask);

router.delete(
  "/delete-restore/:id",
  protectRoute,
  isAdminRoute,
  deleteRestoreTask
); // permanent delete or restore from trash with id

router.delete(
  "/delete-restore",
  protectRoute,
  isAdminRoute,
  deleteRestoreTask
); // permanent delete or restore from trash without id

export default router;
