import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const orderBriefSchema = new mongoose.Schema(
  {
    item: {
      type: String,
    },
    theme: [
      {
        type: ObjectId,
        ref: "Theme",
      },
    ],
    model: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    pose: [
      {
        type: ObjectId,
        ref: "Pose",
      },
    ],
    ratio: [
      {
        type: ObjectId,
        ref: "Ratio",
      },
    ],
    background: [
      {
        type: ObjectId,
        ref: "Background",
      },
    ],
    property: [
      {
        type: ObjectId,
        ref: "Property",
      },
    ],
    note: {
      type: {},
    },
  },
  {
    timestamps: true,
  }
);
// NOTE export
export default mongoose.model("OrderBrief", orderBriefSchema);
