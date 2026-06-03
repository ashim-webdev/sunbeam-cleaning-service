import express from "express";

import {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
} from "../controllers/bookingController.js";
import { protectRoute, isAdminRoute } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js"


const router = express.Router();

router.post("/", createBooking, upload.array("images", 10));

router.get("/", getBookings);

router.get("/:id", getBookingById);

router.put("/:id/status", updateBookingStatus);

router.put(
  "/:id",
  protectRoute,
  isAdminRoute,
  upload.array("images", 10),
  updateBooking
);

router.delete(
  "/:id",
  protectRoute,
  isAdminRoute,
  deleteBooking
);

export default router;