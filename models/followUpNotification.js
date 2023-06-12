import mongoose from "mongoose";

import User from "./user.js";

const { ObjectId } = mongoose.Schema;

const followUpNotificationSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      trim: true,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    user: {
      type: ObjectId,
      ref: User,
      required: true,
    },
    on: {
      type: Boolean,
    },
    done_by: {
      type: ObjectId,
      ref: User,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "FollowUpNotification",
  followUpNotificationSchema
);
