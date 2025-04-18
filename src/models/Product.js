/*
Importera mongoose för att skapa ett schema som kopplas till MongoDB
*/
import mongoose from "mongoose";

/*
Skapa ett schema för produkter
*/
const productSchema = new mongoose.Schema({

/*
Namn på produkten (obligatoriskt och tas bort extra mellanslag)
*/
  name: {
    type: String,
    required: true,
    trim: true,
  },

/*
Pris på produkten (obligatoriskt och kan inte vara negativt)
*/
  price: {
    type: Number,
    required: true,
    min: 0,
  },

/*
En kort beskrivning av produkten (valfritt)
*/
  description: {
    type: String,
    default: "",
  },

/*
Antal i lager (standard är 0, får inte vara negativt)
*/
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },

/*
Vilken kategori produkten tillhör (måste finnas och refererar till kategori-modellen)
*/
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

/*
Länk till produktens bild (obligatoriskt)
*/
  imageUrl: {
    type: String,
    required: true,
  },

/*
Jämförelsepris, t.ex. "10 kr/kg" (valfritt)
*/
  comparePrice: {
    type: String,
    default: "",
  },

/*
Ingredienser (valfritt)
*/
  ingredients: {
    type: String,
    default: "",
  },

/*
Näringsinformation (valfritt)
*/
  nutrition: {
    type: String,
    default: "",
  },

/*
Leverantörens namn (valfritt)
*/
  supplier: {
    type: String,
    default: "",
  },

/*
Varumärke (valfritt)
*/
  brand: {
    type: String,
    default: "",
  },

 /*
 Ursprungsland (valfritt)
 */
  originCountry: {
    type: String,
    default: "",
  },
},

/*
Lägger till createdAt och updatedAt automatiskt
*/
{ timestamps: true }
);

/*
Skapa en modell baserat på schemat ovan
*/
const Product = mongoose.model("Product", productSchema);

/*
Exportera modellen så den kan användas i andra filer
*/
export default Product;




