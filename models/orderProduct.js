import mongoose from "mongoose";

import Product from "./service.js";
import ServiceCategory from "./serviceCategory.js";

const { ObjectId } = mongoose.Schema;

const orderProductSchema = new mongoose.Schema(
  {
    product: {
      type: ObjectId,
      ref: Product,
    },
    category: {
      type: ObjectId,
      ref: ServiceCategory,
    },
    qty: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
    brief: {
      type: ObjectId,
      ref: "OrderBrief",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("OrderProduct", orderProductSchema);
