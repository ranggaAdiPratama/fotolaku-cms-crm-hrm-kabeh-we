import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const modelDetailSchema = new mongoose.Schema(
  {
    model: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    bust: {
      type: Number,
    },
    hip: {
      type: Number,
    },
    gender: {
      type: String,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    ethnicity: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ModelDetail", modelDetailSchema);
