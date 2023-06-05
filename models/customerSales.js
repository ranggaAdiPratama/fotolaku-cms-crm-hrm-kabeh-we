import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const customerSalesSchema = new mongoose.Schema(
  {
    sales: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    customers: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("CustomerSales", customerSalesSchema);
