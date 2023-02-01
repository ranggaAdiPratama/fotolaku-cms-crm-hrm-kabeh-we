import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const { Schema } = mongoose;

const RoleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    permission: [
      {
        type: ObjectId,
        ref: "Permission",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Role", RoleSchema);
