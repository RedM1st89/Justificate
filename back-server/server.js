const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Inicia express y lo guarda en la variable app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Para parsear JSON en los requests

// Puerto
const PORT = process.env.PORT || 5000;

// Conectar a MongoDB (sin las opciones deprecadas)
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('✅ Conectado a MongoDB exitosamente');
  
  // Solo iniciar el servidor después de conectar a la BD
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ Error conectando a MongoDB:', err);
  process.exit(1);
});

app.get('/', (req, res) => {
  res.json({ message: 'API de justificantes funcionando correctamente' });
});