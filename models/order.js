import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: ObjectId,
      ref: "User",
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
        ref: "OrderProduct",
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
      required: true,
    },
    payment: {
      type: ObjectId,
      ref: "Payment",
    },
    link: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);
