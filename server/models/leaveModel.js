import mongoose, { Schema } from "mongoose";

const leaveSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reason: {
      type: String,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "denied"],
      default: "pending",
    },

    message: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Leave = mongoose.model("Leave", leaveSchema);

export default Leave;