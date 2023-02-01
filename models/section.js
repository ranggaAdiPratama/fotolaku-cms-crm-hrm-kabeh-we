import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const sectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    module: [
      {
        type: ObjectId,
        ref: "Module",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Section", sectionSchema);
