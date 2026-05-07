import express from "express";
import userRoutes from "./userRoute.js";
import taskRoutes from "./taskRoute.js";
import leaveRoutes from "./leaveRoutes.js"

const router = express.Router();

router.use("/user", userRoutes);
router.use("/task", taskRoutes);
router.use("/leaves", leaveRoutes);

export default router;
