import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
