/*
Importerar Mongoose
*/
import mongoose from "mongoose";

/*
Schema-definition
*/
const categorySchema = new mongoose.Schema(
  {

/*
name	Obligatoriskt (required: true), unikt, och trim (tar bort mellanslag i början/slut).
description	Valfritt, men trim städar bort onödiga mellanslag
type	Kan t.ex. användas för kategorityp (om du vill skilja på t.ex. "Skafferi" vs. "Färskvaror")
*/
    name: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true 
    },
    description: { 
      type: String, 
      trim: true 
    },
    type: { 
      type: String, 
      trim: true 
    },
  },

/*
Lägger automatiskt till:
createdAt
updatedAt
*/
  { timestamps: true }
)

const Category = mongoose.model("Category", categorySchema)
export default Category




