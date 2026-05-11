import express from "express";

import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

import { protectRoute, isAdminRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();


// Everyone logged in can view events
router.get("/", protectRoute, getEvents);


// Admin only
router.post("/", protectRoute, isAdminRoute, createEvent);

router.put("/:id", protectRoute, isAdminRoute, updateEvent);

router.delete("/:id", protectRoute, isAdminRoute, deleteEvent);

export default router;