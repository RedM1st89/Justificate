const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
// Inicia express y lo guarda en la variable app
const app = express();
// Llama la funcion cors para que todo funcione
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado'))
.catch((err) => console.error('Error:', err));

