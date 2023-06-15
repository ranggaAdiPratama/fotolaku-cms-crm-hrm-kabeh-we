import mongoose from "mongoose";

import UserSource from "./userSource.js";

const { ObjectId } = mongoose.Schema;

const tripayOrderScheme = new mongoose.Schema(
  {
    reference: {
      type: String,
    },
    method: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "PENDING",
    },
    source: {
      type: ObjectId,
      ref: UserSource,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    paid_at: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("TripayOrder", tripayOrderScheme);
