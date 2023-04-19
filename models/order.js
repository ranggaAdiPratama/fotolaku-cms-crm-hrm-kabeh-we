import mongoose from "mongoose";

import OrderProduct from "./orderProduct.js";

const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    brand: {
      type: String,
    },
    sales: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    product: [
      {
        type: ObjectId,
        ref: OrderProduct,
      },
    ],
    items: [
      {
        type: ObjectId,
        ref: "OrderItem",
      },
    ],
    status: {
      type: String,
      default: "New Lead",
    },
    payment: {
      type: ObjectId,
      ref: "Payment",
    },
    total: {
      type: Number,
      trim: true,
      default: 0,
    },
    closing_deadline: {
      type: Date,
    },
    note: {
      type: String,
    },
    serviceNote: {
      type: String,
    },
    link: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);
