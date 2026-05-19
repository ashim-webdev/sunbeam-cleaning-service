import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: { type: String, required: true },

    clientName: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    date: { type: Date, default: new Date() },

    priority: {
      type: String,
      default: "normal",
      enum: ["high", "medium", "normal", "low"],
    },

    stage: {
      type: String,
      default: "todo",
      enum: ["todo", "in progress", "completed"],
    },

    activities: [
      {
        type: {
          type: String,
          default: "assigned",
          enum: [
            "assigned",
            "started",
            "in progress",
            "problem",
            "completed",
            "commented",
            "duplicated",
            "trashed",
            "restored",
          ],
        },
        activity: String,
        date: { type: Date, default: new Date() },
        by: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],

    subTasks: [
      {
        title: String,
        date: Date,
        tag: String,
        isCompleted: Boolean,
      },
    ],

    description: String,

    equipments: [String],

    assets: [
      {
        url: String,
        public_id: String,
      },
    ],

    team: {
      members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      leader: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    },

    isTrashed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
