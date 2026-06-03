import express from "express";
import userRoutes from "./userRoute.js";
import taskRoutes from "./taskRoute.js";
import leaveRoutes from "./leaveRoutes.js"
import eventRoute from "./evenRoute.js"
import bookingRoute from "./bookingRoutes.js"

const router = express.Router();

router.use("/user", userRoutes);
router.use("/task", taskRoutes);
router.use("/leaves", leaveRoutes);
router.use("/events", eventRoute);
router.use("/bookings", bookingRoute);

export default router;
