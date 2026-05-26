import mongoose, { Schema } from "mongoose";

const noticeSchema = new Schema({
  team: [{ type: Schema.Types.ObjectId, ref: "User" }],
  text: String,

  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  refId: { type: Schema.Types.ObjectId },
  refModel: { type: String, enum: ["Task", "Leave"] },

  notiType: {
    type: String,
    default: "alert",
    enum: ["alert", "message"],
  },

  isRead: [{ type: Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

const Notice = mongoose.model("Notice", noticeSchema);

export default Notice;
