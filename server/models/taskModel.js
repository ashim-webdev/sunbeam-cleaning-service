import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

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

    date: {
      type: Date,
      default: new Date(),
    },

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

    // LOCK TASK AFTER FINAL COMPLETION
    isLocked: {
      type: Boolean,
      default: false,
    },

    // FINAL COMPLETION INFO
    completedAt: {
      type: Date,
      default: null,
    },

    completedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
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
            "task_completed",
            "problem",
            "commented",
            "duplicated",
            "trashed",
            "restored",
          ],
        },

        activity: {
          type: String,
          trim: true,
        },

        date: {
          type: Date,
          default: new Date(),
        },

        by: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },

        // COMPLETION / ACTIVITY IMAGES
        images: [
          {
            url: String,

            public_id: String,
          },
        ],
      },
    ],

    subTasks: [
      {
        title: {
          type: String,
          trim: true,
        },

        date: Date,

        tag: String,

        isCompleted: {
          type: Boolean,
          default: false,
        },
      },
    ],

    description: {
      type: String,
      trim: true,
    },

    equipments: [String],

    // MAIN TASK ASSETS
    assets: [
      {
        url: String,

        public_id: String,
      },
    ],

    team: {
      members: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],

      leader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      admins: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },

    // OPTIONAL SUPPORT LINKS
    links: [String],

    isTrashed: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;