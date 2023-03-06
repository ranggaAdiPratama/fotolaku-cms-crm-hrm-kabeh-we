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
      default: null,
    },
    preparedBy: {
      type: ObjectId,
      ref: "User",
      default: null,
    },
    photographer: {
      type: ObjectId,
      ref: "User",
      default: null,
    },
    editor: {
      type: ObjectId,
      ref: "User",
      default: null,
    },
    revised_by: {
      type: ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      default: "Pending Project",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Project", projectSchema);
