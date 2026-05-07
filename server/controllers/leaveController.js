import Leave from "../models/leaveModel.js";

// @desc Create leave request
// POST /api/leaves
export const createLeave = async (req, res) => {
  try {
    const { reason, duration, description } = req.body;

    if (!reason || !duration || !description) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const leave = await Leave.create({
      user: req.user._id,
      reason,
      duration,
      description,
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

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};