import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerName: { 
    type: String, 
    required: true 
  },
  customerEmail: { 
    type: String, 
    required: true 
  },
  orderDate: { 
    type: Date, 
    default: Date.now 
  },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true, min: 1 }
    }
  ],
  totalAmount: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["Pending", "Processing", "Completed", "Cancelled"], 
    default: "Pending" 
  }
});

const Order = mongoose.model("Order", orderSchema);

export default Order;