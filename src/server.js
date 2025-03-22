const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/products');
require('dotenv').config(); 
const app = express();
app.use(express.json());

//Anslut till MongoDB med URI från .env
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

//API-rutter
app.use('/api/products', productRoutes);

//Starta server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
});
