import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const moduleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    show: {
      type: Boolean,
      default: true,
    },
    section: {
      type: ObjectId,
      ref: "Section",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Module", moduleSchema);
