import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  total: { type: Number, required: true },

//Produkterna i beställningen
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true, default: 1 },
    }
  ]
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;

