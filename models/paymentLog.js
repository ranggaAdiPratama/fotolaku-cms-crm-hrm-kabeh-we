import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const paymentLogSchema = new mongoose.Schema({
  total: {
    type: Number,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  payment_method: {
    type: String,
    required: true,
    default: "",
  },
  paid_at: {
    type: Date,
    required: true,
    default: "",
  },
});

export default mongoose.model("PaymentLog", paymentLogSchema);
