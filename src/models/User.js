/*
Importering av moduler
*/
import mongoose from "mongoose";
import bcrypt from "bcrypt";

/*
email	Obligatoriskt, måste vara unikt
password	Obligatoriskt – kommer hash:as
username	Frivilligt, men unikt
admin	false som standard, och kan inte ändras efter att den har satts (immutable)
lastLogin	Senaste inloggning
*/
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, unique: true },
  admin: { type: Boolean, default: false, immutable: true },
  lastLogin: { type: Date, default: null }
});

/*
Körs innan användaren sparas (pre("save"))
Hashar lösenordet endast om det ändrats
bcrypt.hash() skyddar lösenordet med saltning (10 rounds)
*/
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/*
Gör modellen tillgänglig överallt i din app som User
*/
export default mongoose.model("User", userSchema);
