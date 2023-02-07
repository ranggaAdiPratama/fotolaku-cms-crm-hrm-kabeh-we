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
      required: true,
    },
    sales: [
      {
        type: ObjectId,
        ref: "User",
        required: true,
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
    link: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);
