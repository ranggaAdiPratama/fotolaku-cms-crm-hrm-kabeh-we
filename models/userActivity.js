import mongoose from "mongoose";

import User from "./user.js";

const { ObjectId } = mongoose.Schema;

const userActivitySchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: User,
      required: true,
    },
    activity: {
      type: {},
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("UserActivity", userActivitySchema);
