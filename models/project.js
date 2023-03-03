import mongoose from "mongoose";

const { Schema } = mongoose;

const { ObjectId } = mongoose.SchemaTypes;

const projectSchema = new Schema(
  {
    lead: {
      type: ObjectId,
      ref: "Order",
      required: true,
    },
    projectLead: {
      type: ObjectId,
      ref: "User",
      default: "",
    },
    preparedBy: {
      type: ObjectId,
      ref: "User",
      default: "",
    },
    photographer: {
      type: ObjectId,
      ref: "User",
      default: "",
    },
    editor: {
      type: ObjectId,
      ref: "User",
      default: "",
    },
    revised_by: {
      type: ObjectId,
      ref: "User",
      default: "",
    },
    status: {
      type: String,
      default: "Waiting Product",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Project", projectSchema);
