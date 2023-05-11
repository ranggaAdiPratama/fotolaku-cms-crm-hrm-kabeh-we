import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const invoiceSchema = new mongoose.Schema({
  discount: {
    type: Number,
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
  payment_Progress: {
    type: Number,
    trim: true,
    default: 0,
  },
  cicilan: {
    type: Number,
    trim: true,
    default: 0,
  },
  items: {
    type: Number,
    trim: true,
    default: 0,
  },
  total: {
    type: Number,
    trim: true,
    default: 0,
  },
});

export default mongoose.model("Invoice", invoiceSchema);
