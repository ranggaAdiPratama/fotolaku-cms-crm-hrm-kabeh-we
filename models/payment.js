import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const paymentSchema = new mongoose.Schema({
  invoice: {},
  quotation: {},
  total: {
    type: Number,
    required: true,
  },
  log: [
    {
      type: ObjectId,
      ref: "PaymentLog",
    },
  ],
});

export default mongoose.model("Payment", paymentSchema);
