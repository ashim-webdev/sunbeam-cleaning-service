import asyncHandler from "express-async-handler";
import Notice from "../models/notis.js";
import Task from "../models/taskModel.js";
import User from "../models/userModel.js";
import cloudinary from "../utils/cloudinary.js";

// Changed
const createTask = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.user;

    const {
      title,
      stage,
      date,
      priority,
      equipments,
      description,
    } = req.body;

    // ✅ parse JSON fields
    let team = { members: [], leader: null };

    try {
      team = JSON.parse(req.body.team || "{}");
    } catch (e) {
      team = { members: [], leader: null };
    }

    let parsedEquipments = [];

    try {
      parsedEquipments = JSON.parse(equipments || "[]");
    } catch (e) {
      parsedEquipments = [];
    }

    const members = team.members || [];
    const leader = team.leader || null;

    // 🔥 Upload images to Cloudinary
    let assetUrls = [];

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "tasks" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
              }
            );

            stream.end(file.buffer);
          })
      );

      assetUrls = await Promise.all(uploadPromises);
    }

    let text = "New task has been assigned to you";

    if (members.length > 1) {
      text += ` and ${members.length - 1} others.`;
    }

    text += ` Priority: ${priority}, Date: ${new Date(date).toDateString()}`;

    const activity = {
      type: "assigned",
      activity: text,
      by: userId,
    };

    const task = await Task.create({
      title,
      team: { members, leader },
      stage: stage.toLowerCase(),
      date,
      priority: priority.toLowerCase(),
      assets: assetUrls, // ✅ SAVE URLS HERE
      equipments: parsedEquipments,
      activities: activity,
      description,
    });

    await Notice.create({
      team: members,
      text,
      task: task._id,
    });

    for (const user of members) {
      await User.findByIdAndUpdate(user, {
        $push: { tasks: task._id },
      });
    }

    res.status(200).json({
      status: true,
      task,
      message: "Task created successfully.",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: error.message });
  }
});


// Changed
const duplicateTask = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        status: false,
        message: "Task not found",
      });
    }

    // 🔥 activity text
    let text = "New task has been assigned to you";

    if (task.team?.members?.length > 1) {
      text += ` and ${task.team.members.length - 1} others.`;
    }

    text += ` The task priority is set as ${
      task.priority
    }, so check and act accordingly. The task date is ${new Date(
      task.date
    ).toDateString()}. Thank you!!!`;

    const activity = {
      type: "assigned",
      activity: text,
      by: userId,
    };

    // ⚠️ IMPORTANT: convert mongoose doc → plain object
    const taskObj = task.toObject();

    // remove MongoDB identity fields
    delete taskObj._id;
    delete taskObj.createdAt;
    delete taskObj.updatedAt;

    // 🟢 create duplicate safely
    const newTask = await Task.create({
      ...taskObj,
      title: "Duplicate - " + task.title,
      activities: [activity], // reset activity properly
    });

    // 🟢 reassign correct fields explicitly (safe override)
    newTask.team = task.team;
    newTask.subTasks = task.subTasks;
    newTask.assets = task.assets;
    newTask.equipments = task.equipments; // ✅ FIXED (replaces links)
    newTask.priority = task.priority;
    newTask.stage = task.stage;
    newTask.description = task.description;

    await newTask.save();

    // 🔔 notification
    await Notice.create({
      team: newTask.team.members,
      text,
      task: newTask._id,
    });

    res.status(200).json({
      status: true,
      message: "Task duplicated successfully.",
      task: newTask,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});



// Changed
const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        status: false,
        message: "Task not found",
      });
    }

    // ✅ Parse incoming fields
    const {
      title,
      date,
      stage,
      priority,
      description,
    } = req.body;

    const team = req.body.team ? JSON.parse(req.body.team) : {};
    const equipments = req.body.equipments
      ? JSON.parse(req.body.equipments)
      : [];

    // 🔥 1. Upload NEW images
    let assetUrls = [];

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "tasks" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
              }
            );

            stream.end(file.buffer);
          })
      );

      assetUrls = await Promise.all(uploadPromises);
    }

    // 🔥 2. Keep EXISTING images
    const existingAssets = req.body.existingAssets
      ? JSON.parse(req.body.existingAssets)
      : [];

    // 🔥 3. Merge both
    const finalAssets = [...existingAssets, ...assetUrls];

    // ✅ Update fields
    task.title = title;
    task.date = date;
    task.priority = priority.toLowerCase();
    task.stage = stage.toLowerCase();
    task.assets = finalAssets;

    task.team = {
      members: team.members || [],
      leader: team.leader || null,
    };

    task.equipments = equipments;
    task.description = description;

    await task.save();

    res.status(200).json({
      status: true,
      message: "Task updated successfully.",
      task,
    });

  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});




const updateTaskStage = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { stage } = req.body;

    const task = await Task.findById(id);

    task.stage = stage.toLowerCase();

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Task stage changed successfully." });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
});

const updateSubTaskStage = asyncHandler(async (req, res) => {
  try {
    const { taskId, subTaskId } = req.params;
    const { status } = req.body;

    await Task.findOneAndUpdate(
      {
        _id: taskId,
        "subTasks._id": subTaskId,
      },
      {
        $set: {
          "subTasks.$.isCompleted": status,
        },
      }
    );

    res.status(200).json({
      status: true,
      message: status
        ? "Task has been marked completed"
        : "Task has been marked uncompleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
});

const createSubTask = asyncHandler(async (req, res) => {
  const { title, tag, date } = req.body;
  const { id } = req.params;

  try {
    const newSubTask = {
      title,
      date,
      tag,
      isCompleted: false,
    };

    const task = await Task.findById(id);

    task.subTasks.push(newSubTask);

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "SubTask added successfully." });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
});




// Changed some
const getTasks = asyncHandler(async (req, res) => {
  const { userId, isAdmin } = req.user;
  const { stage, isTrashed, search } = req.query;

  let query = { isTrashed: isTrashed ? true : false };

  if (!isAdmin) {
    query["team.members"] = { $all: [userId] };
  }
  if (stage) {
    query.stage = stage;
  }

  if (search) {
    const searchQuery = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { stage: { $regex: search, $options: "i" } },
        { priority: { $regex: search, $options: "i" } },
      ],
    };
    query = { ...query, ...searchQuery };
  }

  let queryResult = Task.find(query)
    .populate({
      path: "team",
      select: "name title email",
    })
    .sort({ _id: -1 });

  const tasks = await queryResult;

  res.status(200).json({
    status: true,
    tasks,
  });
});


// Changed some
const getTask = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id)
      .populate({
        path: "team.members",
        select: "name title role email",
      })
      .populate({
        path: "team.leader",
        select: "name title role email",
      })
      .sort({ _id: -1 });

    res.status(200).json({
      status: true,
      task,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch task", error);
  }
});


// Get analytics for user tasks (for last 5 months)
const getUserAnalytics = async (req, res) => {
  try {
    const { userId } = req.user;

    const tasks = await Task.find({
      "team.members": userId,
      isTrashed: false,
    });

    // ✅ Get last 5 months
    const months = [];
    const now = new Date();

    for (let i = 4; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);

      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`, // unique
        label: d.toLocaleString("default", { month: "long" }),
        todo: 0,
        InProgress: 0,
        completed: 0,
      });
    }

    // ✅ Convert to lookup
    const monthMap = {};
    months.forEach(m => {
      monthMap[m.key] = m;
    });

    // ✅ Loop tasks
    tasks.forEach(task => {
      const date = new Date(task.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth()}`;

      if (monthMap[key]) {
        if (task.stage === "todo") {
          monthMap[key].todo++;
        } else if (task.stage === "in progress") {
          monthMap[key].InProgress++;
        } else if (task.stage === "completed") {
          monthMap[key].completed++;
        }
      }
    });

    // ✅ Final array
    const result = months.map(m => ({
      month: m.label,
      todo: m.todo,
      InProgress: m.InProgress,
      completed: m.completed,
    }));

    res.status(200).json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to get analytics",
    });
  }
};




const postTaskActivity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  const { type, activity } = req.body;

  try {
    const task = await Task.findById(id);

    const data = {
      type,
      activity,
      by: userId,
    };
    task.activities.push(data);

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Activity posted successfully." });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
});

const trashTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);

    task.isTrashed = true;

    await task.save();

    res.status(200).json({
      status: true,
      message: `Task trashed successfully.`,
    });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
});

const deleteRestoreTask = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { actionType } = req.query;

    if (actionType === "delete") {
      await Task.findByIdAndDelete(id);
    } else if (actionType === "deleteAll") {
      await Task.deleteMany({ isTrashed: true });
    } else if (actionType === "restore") {
      const resp = await Task.findById(id);

      resp.isTrashed = false;

      resp.save();
    } else if (actionType === "restoreAll") {
      await Task.updateMany(
        { isTrashed: true },
        { $set: { isTrashed: false } }
      );
    }

    res.status(200).json({
      status: true,
      message: `Operation performed successfully.`,
    });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
});

const dashboardStatistics = asyncHandler(async (req, res) => {
  try {
    const { userId, isAdmin } = req.user;

    // Fetch all tasks from the database
    const allTasks = isAdmin
      ? await Task.find({
          isTrashed: false,
        })
          .populate({
            path: "team",
            select: "name role title email",
          })
          .sort({ _id: -1 })
      : await Task.find({
          isTrashed: false,
          team: { $all: [userId] },
        })
          .populate({
            path: "team",
            select: "name role title email",
          })
          .sort({ _id: -1 });

    const users = await User.find({ isActive: true })
      .select("name title role isActive createdAt")
      .limit(10)
      .sort({ _id: -1 });

    // Group tasks by stage and calculate counts
    const groupedTasks = allTasks?.reduce((result, task) => {
      const stage = task.stage;

      if (!result[stage]) {
        result[stage] = 1;
      } else {
        result[stage] += 1;
      }

      return result;
    }, {});

    const graphData = Object.entries(
      allTasks?.reduce((result, task) => {
        const { priority } = task;
        result[priority] = (result[priority] || 0) + 1;
        return result;
      }, {})
    ).map(([name, total]) => ({ name, total }));

    // Calculate total tasks
    const totalTasks = allTasks.length;
    const last10Task = allTasks?.slice(0, 10);

    // Combine results into a summary object
    const summary = {
      totalTasks,
      last10Task,
      users: isAdmin ? users : [],
      tasks: groupedTasks,
      graphData,
    };

    res
      .status(200)
      .json({ status: true, ...summary, message: "Successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
});

export {
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
};
