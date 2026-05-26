import Leave from "../models/leaveModel.js";
import { emitLeaveCreated, emitLeaveStatusUpdate } from "../utils/socketEvents.js";
import User from "../models/userModel.js";
import Notice from "../models/notis.js";



// @desc Create leave request
// POST /api/leaves
export const createLeave = async (req, res) => {
  try {
    const { reason, description, startDate, endDate } = req.body;

    if (!reason || !description) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!startDate || !endDate) {
      res.status(400);
      throw new Error("Start date and end date are required");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      res.status(400);
      throw new Error("End date cannot be before start date");
    }

    // calculate duration in days
    const duration = Math.ceil(
      (end - start) / (1000 * 60 * 60 * 24)
    ) + 1;

    const leave = await Leave.create({
      user: req.user._id,
      reason,
      duration,
      description,
      startDate,
      endDate,
    });

    // create notification for admins
    const admins = await User.find({ isAdmin: true }).select("_id");
    const adminIds = admins.map(a => a._id);

    await Notice.create({
      team: adminIds,
      text: `${req.user.name || "Someone"} submitted a leave request`,
      sender: req.user._id,
      refId: leave._id,
      refModel: "Leave",
      notiType: "alert",
    });

    emitLeaveCreated({
      leave,
      recipients: adminIds,
    });

    res.status(201).json(leave);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// @desc Get all leaves (admin)
// GET /api/leaves
export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("user", "name email title isActive profileImage")
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc Get logged-in user leaves
// GET /api/leaves/my
export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc Update leave (admin)
// PUT /api/leaves/:id
export const updateLeaveStatus = async (req, res) => {
  try {
    const { status, message } = req.body;

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    leave.status = status;
    leave.message = message;

    const updated = await leave.save();

    // create notification for user
    const userId = leave.user;

    if (status === "approved") {
      await Notice.create({
        team: [userId],
        text: `Your leave request has been approved :)`,
        sender: req.user._id,
        refId: leave._id,
        refModel: "Leave",
        notiType: "message",
      });
    } else if (status === "denied") {
      await Notice.create({
        team: [userId],
        text: `Your leave request was rejected :(`,
        sender: req.user._id,
        refId: leave._id,
        refModel: "Leave",
        notiType: "message",
      });
    }

    emitLeaveStatusUpdate({
      userId,
      leaveId: leave._id,
      status,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc Get leaves by user ID
// GET /api/leaves/user/:id

// @desc Get leaves by user ID
// GET /api/leaves/user/:id

export const getLeavesByUser = async (req, res) => {
  try {

    // prevent invalid object being passed
    if (!req.params.id || req.params.id === "[object Object]") {
      return res.status(400).json({
        message: "Invalid user id",
      });
    }

    const leaves = await Leave.find({
      user: req.params.id,
    })
      .populate("user", "name email title profileImage isActive")
      .sort({ createdAt: -1 });

    res.json(leaves);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};