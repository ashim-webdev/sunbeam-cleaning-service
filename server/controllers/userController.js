import asyncHandler from "express-async-handler";
import Notice from "../models/notis.js";
import User from "../models/userModel.js";
import createJWT from "../utils/index.js";
import cloudinary from "../utils/cloudinary.js";

// POST request - login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res
      .status(401)
      .json({ status: false, message: "Invalid email or password." });
  }

  if (!user?.isActive) {
    return res.status(401).json({
      status: false,
      message: "User account has been deactivated, contact the administrator",
    });
  }

  const isMatch = await user.matchPassword(password);

  if (user && isMatch) {
    createJWT(res, user._id);

    user.password = undefined;

    res.status(200).json(user);
  } else {
    return res
      .status(401)
      .json({ status: false, message: "Invalid email or password" });
  }
});

// POST - Register a new user [updates with image upload]
const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    isAdmin,
    role,
    title,
    tiktok,
    x,
    whatsApp,
    telegram,
  } = req.body;

  if (!name || !email || !password || !role || !title) {
    return res.status(400).json({
      status: false,
      message: "All required fields must be filled",
    });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({
      status: false,
      message: "Email address already exists",
    });
  }

  let imageUrl = "";

  // ✅ If image exists, upload to cloudinary
  if (req.file) {
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "users" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        stream.end(buffer);
      });
    };

    const result = await streamUpload(req.file.buffer);
    imageUrl = result.secure_url;
  }

  const user = await User.create({
    name,
    email,
    password,
    isAdmin: isAdmin === "true",
    role,
    title,
    profileImage: imageUrl, // ✅ SAVE URL
    tiktok,
    x,
    whatsApp,
    telegram,
  });

  user.password = undefined;

  res.status(201).json(user);
});

// POST -  Logout user / clear cookie
const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// @GET -   Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
});

const getTeamList = asyncHandler(async (req, res) => {
  const { search, type } = req.query;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  let query = {};

  // FILTER TYPES
  if (type === "active") {
    query.isActive = true;
  }

  if (type === "disabled") {
    query.isActive = false;
  }

  if (search) {
    const searchLower = search.toLowerCase();

    const searchQuery = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },

        ...(searchLower === "admin"
          ? [{ isAdmin: true }]
          : []),

        ...(searchLower === "user"
          ? [{ isAdmin: false }]
          : []),
      ],
    };

    query = { ...query, ...searchQuery };
  }

  // Total users count
  const totalUsers = await User.countDocuments(query);

  // Paginated users
  const users = await User.find(query)
    .select(
      "name title role email isActive isAdmin createdAt profileImage tiktok x whatsApp telegram"
    )
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    users,
    pagination: {
      page,
      limit,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      hasNextPage: page < Math.ceil(totalUsers / limit),
      hasPrevPage: page > 1,
    },
  });
});

// @GET  - get user notifications
const getNotificationsList = asyncHandler(async (req, res) => {

  const userId = req.user._id;

  const notice = await Notice.find({
    team: { $in: [userId] },
    isRead: { $nin: [userId] },
  })
    .populate("team", "name email profileImage")
    .populate("sender", "name profileImage email")
    .populate("createdBy", "name profileImage email")
    .populate("event")
    .sort({ _id: -1 });

  res.status(200).json(notice);

});

// @GET  - get user task status
const getUserTaskStatus = asyncHandler(async (req, res) => {
  const tasks = await User.find()
    .populate("tasks", "title stage")
    .sort({ _id: -1 });

  res.status(200).json(tasks);
});

// @GET  - get user notifications
// @GET  - mark notifications as read
const markNotificationRead = asyncHandler(async (req, res) => {
  try {

    const userId = req.user._id;

    const { isReadType, id } = req.body;

    // MARK ALL
    if (isReadType === "all") {

      await Notice.updateMany(
        {
          team: userId,
          isRead: { $nin: [userId] },
        },
        {
          $push: { isRead: userId },
        }
      );

    }

    // MARK TASK
    else if (isReadType === "task") {

      await Notice.updateMany(
        {
          team: userId,
          notificationType: "task",
          isRead: { $nin: [userId] },
        },
        {
          $push: { isRead: userId },
        }
      );

    }

    // MARK COMPLETED
    else if (isReadType === "completed") {

      await Notice.updateMany(
        {
          team: userId,
          notificationType: "completed",
          isRead: { $nin: [userId] },
        },
        {
          $push: { isRead: userId },
        }
      );

    }

    // MARK IN PROGRESS
    else if (isReadType === "in-progress") {

      await Notice.updateMany(
        {
          team: userId,
          notificationType: "in-progress",
          isRead: { $nin: [userId] },
        },
        {
          $push: { isRead: userId },
        }
      );

    }

    // MARK TODO
    else if (isReadType === "todo") {

      await Notice.updateMany(
        {
          team: userId,
          notificationType: "todo",
          isRead: { $nin: [userId] },
        },
        {
          $push: { isRead: userId },
        }
      );

    }

    // MARK LEAVE
    else if (isReadType === "leave") {

      await Notice.updateMany(
        {
          team: userId,
          refModel: "Leave",
          isRead: { $nin: [userId] },
        },
        {
          $push: { isRead: userId },
        }
      );

    }

    // MARK EVENT
    else if (isReadType === "event") {

      await Notice.updateMany(
        {
          team: userId,
          refModel: "Event",
          isRead: { $nin: [userId] },
        },
        {
          $push: { isRead: userId },
        }
      );

    }

    // MARK SINGLE
    else {

      await Notice.findOneAndUpdate(
        {
          _id: id,
          isRead: { $nin: [userId] },
        },
        {
          $push: { isRead: userId },
        }
      );

    }

    res.status(201).json({
      status: true,
      message: "Done",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      status: false,
      message: error.message,
    });

  }
});

// PUT - Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const { _id, isAdmin } = req.user;

  const targetId = req.body._id || _id;
  const id = isAdmin ? targetId : _id;

  let imageUrl;

  if (req.file) {
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "users" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        stream.end(buffer);
      });
    };

    const result = await streamUpload(req.file.buffer);
    imageUrl = result.secure_url;
  }

  const user = await User.findById(id);

  if (user) {
    // Everybody
    user.name = req.body.name || user.name;

    if (imageUrl) {
      user.profileImage = imageUrl;
    }

    user.tiktok = req.body.tiktok || user.tiktok;
    user.x = req.body.x || user.x;
    user.whatsApp = req.body.whatsApp || user.whatsApp;
    user.telegram = req.body.telegram || user.telegram;

    // Admin only
    if (isAdmin) {
      user.title = req.body.title || user.title;
      user.role = req.body.role || user.role;

      if (req.body.isAdmin !== undefined) {
        user.isAdmin = req.body.isAdmin === "true";
      }
    }

    const updatedUser = await user.save();

    updatedUser.password = undefined;

    res.status(201).json({
      status: true,
      message: "Profile Updated Successfully.",
      user: updatedUser,
    });
  } else {
    res.status(404).json({ status: false, message: "User not found" });
  }
});

// PUT - active/disactivate user profile
const activateUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (user) {
    user.isActive = req.body.isActive;

    await user.save();

    user.password = undefined;

    res.status(201).json({
      status: true,
      message: `User account has been ${
        user?.isActive ? "activated" : "disabled"
      }`,
    });
  } else {
    res.status(404).json({ status: false, message: "User not found" });
  }
});

const changeUserPassword = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      status: false,
      message: "All fields are required",
    });
  }

  const user = await User.findById(userId).select("+password");

  if (!user) {
    return res.status(404).json({
      status: false,
      message: "User not found",
    });
  }

  const isMatch = await user.matchPassword(oldPassword);

  if (!isMatch) {
    return res.status(400).json({
      status: false,
      message: "Old password is incorrect",
    });
  }

  user.password = newPassword;

  await user.save();

  user.password = undefined;

  res.status(200).json({
    status: true,
    message: "Password changed successfully",
  });
});

// DELETE - delete user account
const deleteUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await User.findByIdAndDelete(id);

  res.status(200).json({ status: true, message: "User deleted successfully" });
});

export {
  activateUserProfile,
  changeUserPassword,
  deleteUserProfile,
  getNotificationsList,
  getTeamList,
  getUserTaskStatus,
  loginUser,
  logoutUser,
  markNotificationRead,
  registerUser,
  updateUserProfile,
  getUserProfile
};
