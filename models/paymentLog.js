import mongoose from "mongoose";
import invoice from "./invoice.js";

const { ObjectId } = mongoose.Schema;

const paymentLogSchema = new mongoose.Schema(
  {
    total: {
      type: Number,
      required: true,
    },
    invoice: {
      type: ObjectId,
      ref: invoice,
    },
    termin: {
      type: Number,
      required: true,
      default: 1,
    },
    is_paid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paid_at: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("PaymentLog", paymentLogSchema);
