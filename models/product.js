import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 160,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
    },
    background: {
      type: Number,
      default: 0,
    },
    ratio: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 0,
    },
    model: {
      type: Number,
      default: 0,
    },
    pose: {
      type: Number,
      default: 0,
    },
    fashion_props: {
      type: Number,
      default: 0,
    },
    angle: {
      type: Number,
      default: 0,
    },
    product_type: {
      type: Number,
      default: 0,
    },
    referrence: {
      type: Number,
      default: 0,
    },
    bts: {
      type: Number,
      default: 0,
    },
    outdoor: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);
