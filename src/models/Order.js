/*
 Importera mongoose för att prata med MongoDB
*/
import mongoose from "mongoose";

/*
Skapar ett schema för beställningar
*/
const orderSchema = new mongoose.Schema({

/*
Namnet på den som beställer måste finnas
*/
  name: { type: String, required: true },

/*
Adress dit beställningen ska skickas måste finnas
*/
  address: { type: String, required: true },

/*
Telefonnummer måste finnas
*/
  phone: { type: String, required: true },

/*
Totalpris för beställningen
*/
  total: { type: Number }, 

/*
En lista av produkter i beställningen
*/
  items: [
    {

/*
Varje produkt är kopplad till ett produkt-id
*/
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },

/*
Antal produkter som har beställts, måste vara minst 1
*/
      quantity: { type: Number, required: true, default: 1 },
    }
  ],

/*
Status för beställningen, kan bara vara en av dessa 4
*/
  status: {
    type: String,
    enum: ["mottagen", "under behandling", "skickad", "levererad"],
    default: "under behandling"
  },
  
/*
Skapar automatiskt "createdAt" och "updatedAt" fält
*/
}, { timestamps: true });

/*
Exportera modellen så att den kan användas i andra filer
*/
const Order = mongoose.model("Order", orderSchema);
export default Order;




