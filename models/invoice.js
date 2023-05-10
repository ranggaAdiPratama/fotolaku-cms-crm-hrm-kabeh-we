import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const invoiceSchema = new mongoose.Schema({
  discount: {
    type: discount,
    default: 0,
  },
  number: {
    type: String,
  },
  date: {
    type: Date,
  },
  note: {
    type: String,
  },
  order: {
    type: ObjectId,
    ref: "Order",
  },
  total: {
    type: Number,
    trim: true,
    default: 0,
  },
});

export default mongoose.model("Invoice", invoiceSchema);
