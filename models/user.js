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
    website: {
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
    source: {
      type: String,
      default: "",
    },
    isOutbound: {
      type: Boolean,
      default: false,
    },
    isNewCustomer: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      default: null,
    },
    follow_up_at: {
      type: Date,
      default: null,
    },
    is_contacted: {
      type: Boolean,
      default: false,
    },
    last_contact: {
      type: Date,
      default: null,
    },
    follow_up_at_by_sales: {
      type: Date,
      default: null,
    },
    is_contacted_by_sales: {
      type: Boolean,
      default: null,
    },
    last_contact_by_sales: {
      type: Date,
      default: null,
    },
    survey_results: {
      type: {},
      default: null,
    },
    interest: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
