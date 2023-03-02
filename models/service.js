import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const serviceSchema = new mongoose.Schema(
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
    backgroundList: [
      {
        type: ObjectId,
        ref: "Background",
      },
    ],
    modelList: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    ratioList: [
      {
        type: ObjectId,
        ref: "Ratio",
      },
    ],
    poseList: [
      {
        type: ObjectId,
        ref: "Pose",
      },
    ],
    propertyList: [
      {
        type: ObjectId,
        ref: "Property",
      },
    ],
    productTypeList: [
      {
        type: ObjectId,
        ref: "ProductType",
      },
    ],
    angleList: [
      {
        type: ObjectId,
        ref: "Angle",
      },
    ],
    themeList: [
      {
        type: ObjectId,
        ref: "Theme",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Service", serviceSchema);
