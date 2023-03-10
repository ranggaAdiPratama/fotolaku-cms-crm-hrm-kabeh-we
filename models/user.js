import mongoose from "mongoose";

import Role from "./role.js";

const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    phone: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    ig: {
      type: String,
      trim: true,
      default: "",
    },
    shopee: {
      type: String,
      trim: true,
      default: "",
    },
    tokped: {
      type: String,
      trim: true,
      default: "",
    },
    webiste: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: Boolean,
      default: true,
    },
    role: {
      type: ObjectId,
      ref: Role,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
