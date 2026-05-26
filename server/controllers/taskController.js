import asyncHandler from "express-async-handler";
import Notice from "../models/notis.js";
import Task from "../models/taskModel.js";
import User from "../models/userModel.js";
import cloudinary from "../utils/cloudinary.js";
import {
  canAccessTask,
  adminOnly,
  canCompleteSubTask,
  canChangeTaskStage,
  getTaskUsers
} from "../utils/taskAuthorization.js";

// Socket.io
import {
  emitTaskCreated,
  emitTaskUpdated,
  emitTaskDeleted,
  emitDashboardUpdate,
} from "../utils/socketEvents.js";





// Changed
const createTask = asyncHandler(async (req, res) => {
  try {
    // ADMIN ONLY
    if (!adminOnly(req.user)) {
      return res.status(403).json({
        status: false,
        message: "Only admins can create tasks",
      });
    }

    const userId = req.user._id;

    const {
      title,
      clientName,
      address,
      stage,
      date,
      priority,
      equipments,
      description,
    } = req.body;

    // VALIDATION
    if  (
      !title ||
      !clientName ||
      !address ||
      !date ||
      !priority ||
      !stage
    ) {
      return res.status(400).json({
        status: false,
        message: "Required fields missing",
      });
    }

    const allowedStages = [
      "todo",
      "in progress",
      "completed",
    ];

    if (!allowedStages.includes(stage.toLowerCase())) {
      return res.status(400).json({
        status: false,
        message: "Invalid stage value",
      });
    }

    // PARSE TEAM
    let team = { members: [], leader: null };

    try {
      team = JSON.parse(req.body.team || "{}");
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: "Invalid team data",
      });
    }

    // PARSE EQUIPMENTS
    let parsedEquipments = [];

    try {
      parsedEquipments = JSON.parse(equipments || "[]");
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: "Invalid equipments data",
      });
    }


    const leader =
    typeof team.leader === "object"
      ? team.leader?._id?.toString()
      : team.leader?.toString() || null;

    // REMOVE leader from members
    const members = (team.members || [])
    .map((member) =>
      typeof member === "object"
        ? member._id?.toString()
        : member?.toString()
    )
    .filter(Boolean)
    .filter(
      (member) => member !== leader?.toString()
    );

    const specialMembers = [...new Set(members)];
    
    if (specialMembers.length !== members.length) {
      return res.status(400).json({
        status: false,
        message: "Duplicate team members are not allowed",
      });
    }


    // FINAL TEAM USERS (members + leader)
    const uniqueMembers = leader
      ? [...specialMembers, leader]
      : specialMembers;



    // VALIDATE MEMBERS EXIST
    const validUsers = await User.find({
      _id: { $in: uniqueMembers },
    }).select("_id");

    if (validUsers.length !== uniqueMembers.length) {
      return res.status(400).json({
        status: false,
        message: "Some team members are invalid",
      });
    }

    // GET ALL ADMINS
    const admins = await User.find({
      isAdmin: true,
    }).select("_id");

    const adminIds = admins.map(
      (admin) => admin._id
    );

    // UPLOAD IMAGES
    let assetUrls = [];

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "tasks" },
              (error, result) => {
                if (error) reject(error);

                resolve({
                  url: result.secure_url,
                  public_id: result.public_id,
                });
              }
            );

            stream.end(file.buffer);
          })
      );

      assetUrls = await Promise.all(uploadPromises);
    }

    // NOTIFICATION TEXT
    let text = "New task has been assigned to you";

    text += `\npriority: ${priority}`;
    text += `\ndate: ${new Date(date).toDateString()}`;



    // ACTIVITY
    const activity = {
      type: "assigned",
      activity: text,
      by: userId,
    };

    // CREATE TASK
    const task = await Task.create({
      title,
      clientName,
      address,
      team: { 
        members: specialMembers,
        leader,
        admins: adminIds,
      },
      stage: stage.toLowerCase(),
      date,
      priority: priority.toLowerCase(),
      assets: assetUrls,
      equipments: parsedEquipments,
      activities: [activity],
      description,
    });

    // ALL USERS TO NOTIFY
    const taskUsers = getTaskUsers(task);

    // CREATE NOTICE
    await Notice.create({
      team: taskUsers,
      text,
      task: task._id,
    });

    // PUSH TASK TO USERS
    await Promise.all(
      uniqueMembers.map((user) =>
        User.findByIdAndUpdate(user, {
          $addToSet: { tasks: task._id },
        })
      )
    );



    // socket.io getting task
    emitTaskCreated(task);
    emitDashboardUpdate();



    res.status(201).json({
      status: true,
      task,
      message: "Task created successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});



// Changed
const duplicateTask = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // FIND ORIGINAL TASK
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        status: false,
        message: "Task not found",
      });
    }

    // ADMIN ONLY
    if (!adminOnly(req.user)) {
      return res.status(403).json({
        status: false,
        message: "Only admins can duplicate tasks",
      });
    }

    // NOTIFICATION TEXT
    let text = "New duplicated task has been assigned to you";

    text += `\npriority: ${task.priority}`;
    text += `\ndate: ${new Date(task.date).toDateString()}`;



    // NEW ACTIVITY
    const activity = {
      type: "duplicated",
      activity: text,
      by: userId,
    };

    // CONVERT TASK TO PLAIN OBJECT
    const taskObj = task.toObject();

    // REMOVE FIELDS THAT SHOULD NOT BE COPIED
    delete taskObj._id;
    delete taskObj.createdAt;
    delete taskObj.updatedAt;
    delete taskObj.activities;
    delete taskObj.__v;

    // CLEAN TITLE
    const cleanTitle = task.title.replace(
      /^Duplicate\s-\s/,
      ""
    );

    // CREATE DUPLICATED TASK
    // GET REAL ADMINS
    const admins = await User.find({
      isAdmin: true,
    }).select("_id");

    const adminIds = admins.map(
      (admin) => admin._id
    );

    // CREATE DUPLICATED TASK
    const newTask = await Task.create({
      ...taskObj,

      title: `Duplicate - ${cleanTitle}`,

      stage: "todo",

      isLocked: false,

      completedAt: null,

      completedBy: null,

      team: {
        members: task.team?.members || [],
        leader: task.team?.leader || null,
        admins: adminIds,
      },

      activities: [activity],
    });


    // CREATE NOTICE
    const taskUsers = getTaskUsers(newTask);

    await Notice.create({
      team: taskUsers,
      text,
      task: newTask._id,
    });

    await Promise.all(
      taskUsers.map((user) =>
        User.findByIdAndUpdate(user, {
          $addToSet: {
            tasks: newTask._id,
          },
        })
      )
    );


    // socket.io getting duplicated task
    emitTaskCreated(newTask);
    emitDashboardUpdate();



    res.status(201).json({
      status: true,
      message: "Task duplicated successfully",
      task: newTask,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});



// Changed
const updateTask = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // FIND TASK
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        status: false,
        message: "Task not found",
      });
    }

    // AUTHORIZATION
    if (!adminOnly(req.user)) {
      return res.status(403).json({
        status: false,
        message: "Only admins can update tasks",
      });
    }

    // LOCKED TASKS CANNOT BE EDITED
    if (task.isLocked) {
      return res.status(400).json({
        status: false,
        message: "Completed tasks cannot be edited",
      });
    }

    // EXTRACT BODY
    const {
      title,
      clientName,
      address,
      stage,
      date,
      priority,
      description,
    } = req.body;

    // VALIDATION
    if  (
      !title ||
      !clientName ||
      !address ||
      !date ||
      !priority ||
      !stage
    ) {
      return res.status(400).json({
        status: false,
        message: "Required fields missing",
      });
    }

    // VALIDATE STAGE
    const allowedStages = [
      "todo",
      "in progress",
      "completed",
    ];

    if (!allowedStages.includes(stage.toLowerCase())) {
      return res.status(400).json({
        status: false,
        message: "Invalid stage",
      });
    }

    // PARSE TEAM
    let team = {};

    try {
      team = req.body.team
        ? JSON.parse(req.body.team)
        : {};
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: "Invalid team data",
      });
    }

    // PARSE EQUIPMENTS
    let parsedEquipments = [];

    try {
      parsedEquipments = req.body.equipments
        ? JSON.parse(req.body.equipments)
        : [];
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: "Invalid equipments data",
      });
    }

    const leader =
    typeof team.leader === "object"
      ? team.leader?._id?.toString()
      : team.leader?.toString() || null;

    // REMOVE leader from members
    const members = (team.members || [])
    .map((member) =>
      typeof member === "object"
        ? member._id?.toString()
        : member?.toString()
    )
    .filter(Boolean)
    .filter(
      (member) => member !== leader?.toString()
    );

    const specialMembers = [...new Set(members)];
    
    if (specialMembers.length !== members.length) {
      return res.status(400).json({
        status: false,
        message: "Duplicate team members are not allowed",
      });
    }


    // FINAL TEAM USERS (members + leader)
    const uniqueMembers = leader
      ? [...specialMembers, leader]
      : specialMembers;


    const validUsers = await User.find({
      _id: { $in: uniqueMembers },
    }).select("_id");

    if (validUsers.length !== uniqueMembers.length) {
      return res.status(400).json({
        status: false,
        message: "Some team members are invalid",
      });
    }

    // GET ALL ADMINS
    const admins = await User.find({
      isAdmin: true,
    }).select("_id");

    const adminIds = admins.map(
      (admin) => admin._id
    );

    // UPLOAD NEW IMAGES
    let newAssets = [];

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "tasks" },
              (error, result) => {
                if (error) reject(error);

                resolve({
                  url: result.secure_url,
                  public_id: result.public_id,
                });
              }
            );

            stream.end(file.buffer);
          })
      );

      newAssets = await Promise.all(uploadPromises);
    }

    // EXISTING ASSETS
    let existingAssets = [];

    try {
      existingAssets = req.body.existingAssets
        ? JSON.parse(req.body.existingAssets)
        : [];
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: "Invalid existing assets data",
      });
    }

    // FIND REMOVED ASSETS
    const removedAssets = task.assets.filter(
      (oldAsset) =>
        !existingAssets.some(
          (asset) => asset.public_id === oldAsset.public_id
        )
    );

    // DELETE REMOVED IMAGES FROM CLOUDINARY
    if (removedAssets.length > 0) {
      await Promise.all(
        removedAssets.map((asset) =>
          cloudinary.uploader.destroy(asset.public_id)
        )
      );
    }

    // FINAL ASSETS
    const finalAssets = [
      ...existingAssets,
      ...newAssets,
    ];

    // SUPPORT OLD + NEW TASK STRUCTURE
    let oldMembers = [];

    if (Array.isArray(task.team)) {
      // OLD TASK STRUCTURE
      oldMembers = task.team.map((m) => m.toString());
    } else {
      // NEW TASK STRUCTURE
      oldMembers = [
        ...(task.team?.members || []).map((m) => m.toString()),
        ...(task.team?.leader
          ? [task.team.leader.toString()]
          : []),
      ];
    }

    const newMembers = uniqueMembers.map((m) =>
      m.toString()
    );

    // USERS REMOVED FROM TASK
    const removedUsers = oldMembers.filter(
      (member) => !newMembers.includes(member)
    );

    // USERS NEWLY ADDED
    const addedUsers = newMembers.filter(
      (member) => !oldMembers.includes(member)
    );

    // REMOVE TASK FROM REMOVED USERS
    await Promise.all(
      removedUsers.map((userId) =>
        User.findByIdAndUpdate(userId, {
          $pull: { tasks: task._id },
        })
      )
    );

    // ADD TASK TO NEW USERS
    await Promise.all(
      addedUsers.map((userId) =>
        User.findByIdAndUpdate(userId, {
          $addToSet: { tasks: task._id },
        })
      )
    );

    // NOTIFY NEW USERS
    if (addedUsers.length > 0) {
      await Notice.create({
        team: addedUsers,
        text: `You have been added to task "${task.title}"`,
        task: task._id,
      });
    }

    // UPDATE TASK
    task.title = title;
    task.clientName = clientName;
    task.address = address;
    task.date = date;
    task.stage = stage.toLowerCase();
    task.priority = priority.toLowerCase();
    task.description = description;

    task.team = {
      members: specialMembers,
      leader,
      admins: adminIds,
    };

    task.equipments = parsedEquipments;
    task.assets = finalAssets;

    await task.save();

    await Notice.create({
      team: getTaskUsers(task),
      text: `Task "${task.title}" has been updated`,
      task: task._id,
    });


    // Socket.io getting updated task
    const updatedTask = await Task.findById(task._id)
      .populate("team.members", "name title role email profileImage")
      .populate("team.leader", "name title role email profileImage")
      .populate("team.admins", "name title role email profileImage")
      .populate("activities.by", "name email profileImage")
      .populate("completedBy", "name title role email profileImage");

    emitTaskUpdated(updatedTask);
    emitDashboardUpdate();



    res.status(200).json({
      status: true,
      message: "Task updated successfully",
      task,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});



const updateTaskStage = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { stage } = req.body;

    if (!stage) {
      return res.status(400).json({
        status: false,
        message: "Stage is required",
      });
    }

    // VALID STAGES
    const allowedStages = [
      "todo",
      "in progress",
      "completed",
    ];

    if (
      !allowedStages.includes(stage.toLowerCase())
    ) {
      return res.status(400).json({
        status: false,
        message: "Invalid stage value",
      });
    }

    // FIND TASK
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        status: false,
        message: "Task not found",
      });
    }

    // ONLY ADMIN OR LEADER
    if (!canChangeTaskStage(task, req.user)) {
      return res.status(403).json({
        status: false,
        message: "Only admin and leader are authorized",
      });
    }

    // LOCKED TASKS ARE PERMANENT
    if (task.isLocked) {
      return res.status(400).json({
        status: false,
        message: "This task has already been completed permanently",
      });
    }

    // UPDATE STAGE
    task.stage = stage.toLowerCase();

    // HANDLE TASK COMPLETION
    if (stage.toLowerCase() === "completed") {

      // CHECK FOR INCOMPLETE SUBTASKS
      const incompleteSubTasks = task.subTasks.filter(
        (t) => !t.isCompleted
      );

      if (incompleteSubTasks.length > 0) {
        return res.status(400).json({
          status: false,
          message:
            "Cannot complete task. All subtasks must be completed first.",
        });
      }

      // CHECK IF COMPLETION ACTIVITY EXISTS
      const hasCompletionActivity = task.activities.some(
        (activity) =>
          activity.type?.toLowerCase() === "task_completed"
      );

      if (!hasCompletionActivity) {
        return res.status(400).json({
          status: false,
          message:
            "Task cannot be completed until a completion activity is posted.",
        });
      }

      // LOCK TASK
      task.isLocked = true;

      // SAVE COMPLETION INFO
      task.completedAt = new Date();

      task.completedBy = req.user._id;

      task.activities.push({
        type: "task_completed",
        activity: `${req.user.name} marked this task as permanently completed`,
        by: req.user._id,
      });

    } else {

      task.activities.push({
        type: "in progress",
        activity: `Task stage updated to ${stage}`,
        by: req.user._id,
      });

    }

    await task.save();

    const taskUsers = getTaskUsers(task);

    await Notice.create({
      team: taskUsers,
      text: `Task "${task.title}" stage changed to ${stage}`,
      task: task._id,
    });

    // Socket.io updating task stage
    const updatedTask = await Task.findById(task._id)
      .populate("team.members", "name title role email profileImage")
      .populate("team.leader", "name title role email profileImage")
      .populate("team.admins", "name title role email profileImage")
      .populate("activities.by", "name email profileImage")
      .populate("completedBy", "name title role email profileImage");

    emitTaskUpdated(updatedTask);
    emitDashboardUpdate();


    res.status(200).json({
      status: true,
      message: "Task stage changed successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});



const updateSubTaskStage = asyncHandler(async (req, res) => {
  try {
    const { taskId, subTaskId } = req.params;
    const { status } = req.body;

    if (typeof status !== "boolean") {
      return res.status(400).json({
        status: false,
        message: "Status must be boolean",
      });
    }

    // FIRST fetch task
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        status: false,
        message: "Task not found",
      });
    }

    // ONLY ADMIN OR LEADER
    if (!canCompleteSubTask(task, req.user)) {
      return res.status(403).json({
        status: false,
        message: "Only admin or leader can complete subtasks",
      });
    }

    // LOCKED TASKS CANNOT MODIFY SUBTASKS
    if (task.isLocked) {
      return res.status(400).json({
        status: false,
        message: "Completed task subtasks cannot be modified",
      });
    }

    // Update subtask
    const updatedTask = await Task.findOneAndUpdate(
      {
        _id: taskId,
        "subTasks._id": subTaskId,
      },
      {
        $set: {
          "subTasks.$.isCompleted": status,
        },
      },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        status: false,
        message: "Task or Subtask not found",
      });
    }


    const taskUpdate = await Task.findById(taskId)
      .populate("team.members", "name title email profileImage")
      .populate("team.leader", "name title email profileImage")
      .populate("team.admins", "name title email profileImage")
      .populate("activities.by", "name profileImage");

      await Notice.create({
        team: getTaskUsers(task),
        text: `${req.user.name} updated a subtask in "${task.title}"`,
        task: task._id,
      });

    // Socket.io updating subTask stage
    emitTaskUpdated(taskUpdate);
    emitDashboardUpdate();


    res.status(200).json({
      status: true,
      message: status
        ? "Task has been marked completed"
        : "Task has been marked uncompleted",
    });

  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

const createSubTask = asyncHandler(async (req, res) => {
  try {
    const { title, tag, date } = req.body;
    const { id } = req.params;

    if (!title || !date) {
      return res.status(400).json({
        status: false,
        message: "Required fields missing",
      });
    }

    // FIRST fetch task
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        status: false,
        message: "Task not found",
      });
    }

    // THEN authorize
    if (!canAccessTask(task, req.user)) {
      return res.status(403).json({
        status: false,
        message: "Unauthorized",
      });
    }

    // LOCKED TASKS CANNOT RECEIVE SUBTASKS
    if (task.isLocked) {
      return res.status(400).json({
        status: false,
        message: "Cannot add subtasks to completed task",
      });
    }

    if (isNaN(new Date(date).getTime())) {
      return res.status(400).json({
        status: false,
        message: "Invalid date",
      });
    }

    const newSubTask = {
      title,
      date,
      tag,
      isCompleted: false,
    };

    task.subTasks.push(newSubTask);

    await task.save();

    const taskUsers = getTaskUsers(task);

    await Notice.create({
      team: taskUsers,
      text: `New subtask added to "${task.title}"`,
      task: task._id,
    });

    const updatedTask = await Task.findById(id);

    if (updatedTask?.team?.members) {
      await updatedTask.populate({
        path: "team.members",
        select: "name title role email profileImage",
      });

      await updatedTask.populate({
        path: "team.leader",
        select: "name title role email profileImage",
      });

      await updatedTask.populate({
        path: "team.admins",
        select: "name title role email profileImage",
      });
    }


    // SOCKET.IO REALTIME
    emitTaskUpdated(updatedTask);
    emitDashboardUpdate();

    res.status(200).json({
      status: true,
      message: "SubTask added successfully.",
    });

  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});




// Changed some
const getTasks = asyncHandler(async (req, res) => {
  try {
    const { _id: userId, isAdmin } = req.user;
    const { stage, isTrashed, search } = req.query;

    // Pagination
    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );
    const limit = Math.min(
      Number(req.query.limit) || 10,
      50
    );
    const skip = (page - 1) * limit;

    let query = {
      isTrashed: isTrashed === "true",
    };

    const searchConditions = search
      ? [
          { title: { $regex: search, $options: "i" } },
          { stage: { $regex: search, $options: "i" } },
          { priority: { $regex: search, $options: "i" } },
        ]
      : [];

    if (!isAdmin) {
      query.$and = [
        {
          $or: [
            { "team.members": userId },
            { "team.leader": userId },
          ],
        },
      ];

      if (searchConditions.length > 0) {
        query.$and.push({
          $or: searchConditions,
        });
      }
    } else if (searchConditions.length > 0) {
      query.$or = searchConditions;
    }

    // Filter by stage
    if (stage) {
      query.stage = stage;
    }

    // Total count
    const totalTasks = await Task.countDocuments(query);

    // Fetch tasks
    const tasks = await Task.find(query)
      .populate({
        path: "team.members",
        select: "name title role email profileImage",
      })
      .populate({
        path: "team.leader",
        select: "name title role email profileImage",
      })
      .populate({
        path: "activities.by",
        select: "name email profileImage",
      })
      .populate({
        path: "team.admins",
        select: "name title role email profileImage",
      })
      .populate({
        path: "completedBy",
        select: "name title role email profileImage isAdmin",
      })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      status: true,
      tasks,
      page,
      limit,
      totalTasks,
      totalPages: Math.ceil(totalTasks / limit),
    });

  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});


// Changed some
const getTask = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id)
      .populate({
        path: "team.members",
        select: "name title role email profileImage",
      })
      .populate({
        path: "team.leader",
        select: "name title role email profileImage",
      })
      .populate({
        path: "activities.by",
        select: "name email profileImage",
      })
      .populate({
        path: "team.admins",
        select: "name title role email profileImage",
      })
      .populate({
        path: "completedBy",
        select: "name title role email profileImage isAdmin",
      })

    if (!task) {
      return res.status(404).json({
        status: false,
        message: "Task not found",
      });
    }

    // Authorization
    if (!canAccessTask(task, req.user)) {
      return res.status(403).json({
        status: false,
        message: "Unauthorized",
      });
    }

    res.status(200).json({
      status: true,
      task,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});


// Get analytics for user tasks (for last 5 months)
const getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    const tasks = await Task.find({
      isTrashed: false,
      $or: [
        { "team.members": userId },
        { "team.leader": userId },
      ],
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
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { type, activity } = req.body || {};

    if (!type || !activity) {
      return res.status(400).json({
        status: false,
        message: "Required fields missing",
      });
    }

    // FIRST fetch task
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        status: false,
        message: "Task not found",
      });
    }

    // THEN authorize
    if (!canAccessTask(task, req.user)) {
      return res.status(403).json({
        status: false,
        message: "Unauthorized",
      });
    }

    // LOCKED TASKS CANNOT RECEIVE NEW ACTIVITIES
    if (task.isLocked) {
      return res.status(400).json({
        status: false,
        message: "Completed task cannot receive new activities",
      });
    }


    let uploadedImages = [];

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "task-activities" },
              (error, result) => {
                if (error) reject(error);

                resolve({
                  url: result.secure_url,
                  public_id: result.public_id,
                });
              }
            );

            stream.end(file.buffer);
          })
      );

      uploadedImages = await Promise.all(uploadPromises);
    }

    // REQUIRE 5 IMAGES FOR TASK COMPLETION
    if (
      type?.toLowerCase() === "task_completed" &&
      uploadedImages.length < 5
    ) {
      return res.status(400).json({
        status: false,
        message:
          "At least 5 after-cleaning images are required.",
      });
    }


    // ONLY ADMIN AND LEADER CAN COMPLETE
    if (
      type?.toLowerCase() === "task_completed" &&
      !canChangeTaskStage(task, req.user)
    ) {
      return res.status(403).json({
        status: false,
        message: "Only admin or leader can complete tasks",
      });
    }

    const data = {
      type,
      activity,
      by: userId,
      images: uploadedImages,
    };


    // just log activity — NO SIDE EFFECTS
    task.activities.push(data);


    await task.save();

    const taskUsers = getTaskUsers(task);

    await Notice.create({
      team: taskUsers,
      text: `${req.user.name} posted a new activity in "${task.title}"`,
      task: task._id,
    });


    const updatedTask = await Task.findById(id)
      .populate({
        path: "team.members",
        select: "name title role email profileImage",
      })
      .populate({
        path: "team.leader",
        select: "name title role email profileImage",
      })
      .populate({
        path: "activities.by",
        select: "name email profileImage",
      })
      .populate({
        path: "team.admins",
        select: "name title role email profileImage",
      })


    // Socket.io updating postActivities
    emitTaskUpdated(updatedTask);


    res.status(200).json({
      status: true,
      message: "Activity posted successfully.",
    });

  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});



const trashTask = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // FIND TASK
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        status: false,
        message: "Task not found",
      });
    }

    // ADMIN ONLY
    if (!adminOnly(req.user)) {
      return res.status(403).json({
        status: false,
        message: "Only admins can trash tasks",
      });
    }

    // if (task.isLocked) {
    //   return res.status(400).json({
    //     status: false,
    //     message: "Completed tasks cannot be trashed",
    //   });
    // }

    // ALREADY TRASHED
    if (task.isTrashed) {
      return res.status(400).json({
        status: false,
        message: "Task is already trashed",
      });
    }

    // ACTIVITY
    const activity = {
      type: "trashed",
      activity: `Task moved to trash by ${req.user.name}`,
      by: req.user._id,
    };

    task.activities.push(activity);

    // MOVE TO TRASH
    task.isTrashed = true;

    await task.save();

    // OPTIONAL NOTICE
    const taskUsers = getTaskUsers(task);

    await Notice.create({
      team: taskUsers,
      text: `Task "${task.title}" has been moved to trash.`,
      task: task._id,
    });


    // Socket.io updating task after trashed
    const updatedTask = await Task.findById(task._id)
      .populate("team.members", "name title role email profileImage")
      .populate("team.leader", "name title role email profileImage")
      .populate("team.admins", "name title role email profileImage")
      .populate("activities.by", "name email profileImage")
      .populate("completedBy", "name title role email profileImage");

    emitTaskUpdated(updatedTask);
    emitDashboardUpdate();


    res.status(200).json({
      status: true,
      message: "Task trashed successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});



const deleteRestoreTask = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { actionType } = req.query;

    // ADMIN ONLY
    if (!adminOnly(req.user)) {
      return res.status(403).json({
        status: false,
        message: "Only admins can perform this action",
      });
    }

    // VALID ACTION TYPES
    const allowedActions = [
      "delete",
      "deleteAll",
      "restore",
      "restoreAll",
    ];

    if (!allowedActions.includes(actionType)) {
      return res.status(400).json({
        status: false,
        message: "Invalid action type",
      });
    }

    // =========================================
    // DELETE SINGLE TASK
    // =========================================
    if (actionType === "delete") {

      const task = await Task.findById(id);

      if (!task) {
        return res.status(404).json({
          status: false,
          message: "Task not found",
        });
      }

      // DELETE CLOUDINARY ASSETS
      if (task.assets?.length > 0) {
        await Promise.all(
          task.assets.map((asset) =>
            cloudinary.uploader.destroy(
              asset.public_id
            )
          )
        );
      }

      // REMOVE TASK FROM USERS
      const taskUsers = getTaskUsers(task);

      await Promise.all(
        taskUsers.map((userId) =>
          User.findByIdAndUpdate(userId, {
            $pull: { tasks: task._id },
          })
        )
      );

      // DELETE TASK
      await Task.findByIdAndDelete(id);

      
      // Socket.io getting single task delete ID
      emitTaskDeleted(id);
      emitDashboardUpdate();


      return res.status(200).json({
        status: true,
        message: "Task permanently deleted",
      });
    }

    // =========================================
    // DELETE ALL TRASHED TASKS
    // =========================================
    if (actionType === "deleteAll") {

      const trashedTasks = await Task.find({
        isTrashed: true,
      });

      // DELETE CLOUDINARY FILES
      for (const task of trashedTasks) {
        if (task.assets?.length > 0) {
          await Promise.all(
            task.assets.map((asset) =>
              cloudinary.uploader.destroy(
                asset.public_id
              )
            )
          );
        }

        // REMOVE TASK REFERENCES
        const taskUsers = getTaskUsers(task);

        await Promise.all(
          taskUsers.map((userId) =>
            User.findByIdAndUpdate(userId, {
              $pull: { tasks: task._id },
            })
          )
        );
      }

      // DELETE TASKS
      await Task.deleteMany({
        isTrashed: true,
      });

      emitDashboardUpdate()

      return res.status(200).json({
        status: true,
        message: "All trashed tasks deleted",
      });
    }

    // =========================================
    // RESTORE SINGLE TASK
    // =========================================
    if (actionType === "restore") {

      const task = await Task.findById(id);

      if (!task) {
        return res.status(404).json({
          status: false,
          message: "Task not found",
        });
      }

      if (!task.isTrashed) {
        return res.status(400).json({
          status: false,
          message: "Task is not trashed",
        });
      }

      // ACTIVITY
      task.activities.push({
        type: "restored",
        activity: `Task restored by ${req.user.name}`,
        by: req.user._id,
      });

      task.isTrashed = false;

      await task.save();

      await Notice.create({
        team: getTaskUsers(task),
        text: `Task "${task.title}" has been restored`,
        task: task._id,
      });

      const updatedTask = await Task.findById(task._id)
        .populate("team.members", "name title role email profileImage")
        .populate("team.leader", "name title role email profileImage")
        .populate("team.admins", "name title role email profileImage")
        .populate("activities.by", "name email profileImage")
        .populate("completedBy", "name title role email profileImage");

      emitTaskUpdated(updatedTask);
      emitDashboardUpdate()

      return res.status(200).json({
        status: true,
        message: "Task restored successfully",
      });
    }

    // =========================================
    // RESTORE ALL TASKS
    // =========================================
    if (actionType === "restoreAll") {

      await Task.updateMany(
        { isTrashed: true },
        {
          $set: { isTrashed: false },
        }
      );

      emitDashboardUpdate()

      return res.status(200).json({
        status: true,
        message: "All tasks restored successfully",
      });
    }

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});



const dashboardStatistics = asyncHandler(async (req, res) => {
  try {
    const { _id: userId, isAdmin } = req.user;

    // Fetch all tasks from the database
const allTasks = isAdmin
  ? await Task.find({
      isTrashed: false,
    })
      .populate({
        path: "team.members",
        select: "name title role email profileImage isActive",
      })
      .populate({
        path: "team.leader",
        select: "name title role email profileImage isActive",
      })
      .populate({
        path: "team.admins",
        select: "name title role email profileImage",
      })
      .populate({
        path: "completedBy",
        select: "name title role email profileImage isAdmin",
      })
      .sort({ _id: -1 })

  : await Task.find({
      isTrashed: false,
      $or: [
        { "team.members": userId },
        { "team.leader": userId },
      ],
    })
      .populate({
        path: "team.members",
        select: "name title role email profileImage isActive",
      })
      .populate({
        path: "team.leader",
        select: "name title role email profileImage isActive",
      })
      .populate({
        path: "completedBy",
        select: "name title role email profileImage isAdmin",
      })
      .sort({ _id: -1 });

    const users = await User.find({})
      .select("name title role isActive email profileImage createdAt isAdmin tiktok x whatsApp telegram")
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
      users: users,
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


const deleteTaskActivity = asyncHandler(async (req, res) => {
  const { taskId, activityId } = req.params;

  const task = await Task.findById(taskId);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (task.isLocked) {
    res.status(400);
    throw new Error("Cannot modify activities of completed task");
  }

  const activity = task.activities.id(activityId);

  if (!activity) {
    res.status(404);
    throw new Error("Activity not found");
  }

  const isOwner =
    activity.by.toString() === req.user._id.toString();

  const isAdmin = req.user.isAdmin;

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error("Unauthorized");
  }

  task.activities.pull(activityId);

  await task.save();

  const updatedTask = await Task.findById(taskId)
    .populate({
      path: "team.members",
      select: "name title role email profileImage",
    })
    .populate({
      path: "team.leader",
      select: "name title role email profileImage",
    })
    .populate({
      path: "activities.by",
      select: "name email profileImage",
    })
    .populate({
      path: "team.admins",
      select: "name title role email profileImage",
    })

  emitTaskUpdated(updatedTask);

  res.status(200).json({
    status: true,
    message: "Comment deleted successfully",
  });
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
  getUserAnalytics,
  deleteTaskActivity
};
