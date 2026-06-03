import mongoose, { Schema } from "mongoose";

const noticeSchema = new Schema(
  {
    team: [{ type: Schema.Types.ObjectId, ref: "User" }],

    text: String,

    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },

    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      default: null,
    },

    refId: {
      type: Schema.Types.ObjectId,
    },

    refModel: {
      type: String,
      enum: ["Task", "Leave", "Event", "Booking"],
    },

    notificationType: {
      type: String,
      enum: [
        "task",
        "completed",
        "in-progress",
        "todo",
        "leave",
        "event",
        "booking",
      ],
      default: "task",
    },

    type: {
      type: String,
      enum: ["alert", "message", "event"],
      default: "alert",
    },

    isRead: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Notice = mongoose.model("Notice", noticeSchema);

export default Notice;
