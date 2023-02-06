import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const permissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    alias: {
      type: String,
      required: true,
    },
    module: {
      type: ObjectId,
      ref: "Module",
      required: true,
    },
    sub_module: {
      type: ObjectId,
      ref: "Module",
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Permission", permissionSchema);
