import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    start: {
      type: Date,
      required: true,
    },

    end: {
      type: Date,
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;