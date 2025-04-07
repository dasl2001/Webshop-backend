/*
 Importerar Mongoose
*/
import mongoose from "mongoose";

/*
Schema-definition
*/
const productSchema = new mongoose.Schema(
  {

/*
Måste anges (required)
trim tar bort onödiga mellanslag före/efter
*/
    name: {
      type: String,
      required: true,
      trim: true,
    },

/*
Krävs och får inte vara negativt
*/
    price: {
      type: Number,
      required: true,
      min: 0,
    },

/*
Valfritt fält, men om det inte anges blir det en tom sträng
*/
    description: {
      type: String,
      default: "",
    },

/*
Lagerantal – kan inte vara negativt
Om inget anges blir det 0
*/
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

/*
Denna produkt måste tillhöra en kategori
Refererar till Category-modellen (via ObjectId)
Gör det möjligt att använda .populate("category") för att hämta all info om kategorin
*/
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

/*
Länk till produktbild
*/
    imageUrl: {
      type: String,
      required: true,
    },

    jämförpris: {
      type: String,
      default: "",
    },

    innehållsförteckning: {
      type: String,
      default: "",
    },

    näringsvärde: {
      type: String,
      default: "",
    },

    leverantör: {
      type: String,
      default: "",
    },

    varumärke: {
      type: String,
      default: "",
    },

    ursprungsland: {
      type: String,
      default: "",
    },
  },

/*
Lägger automatiskt till createdAt och updatedAt – perfekt för att visa senaste uppdatering
*/
  { timestamps: true }
);

/*
Registrerar modellen som "Product"
Exporterar den för användning i routes/controllers
*/
const Product = mongoose.model("Product", productSchema);
export default Product;



