// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
 
// --- Importar rutas ---
const authRoutes = require('./Routes/Auth');
const examRoutes = require('./Routes/Exams');
const questionRoutes = require('./Routes/Questions');
const resultRoutes = require('./Routes/Results');
 
const app = express();
const PORT = process.env.PORT || 3000;
 
// --- Middlewares globales (ORDEN IMPORTANTE) ---
app.use(cors());
app.use(express.json());
app.use(cookieParser());
 
// --- Conexión a MongoDB ---
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((err) =>
    console.error('❌ Error de conexión a MongoDB:', err.message)
  );
 
// --- Rutas ---
app.use('/api/Auth', authRoutes);         // Login / registro
app.use('/api/Exams', examRoutes);        // CRUD de exámenes
app.use('/api/Questions', questionRoutes); // CRUD de preguntas
app.use('/api/Results', resultRoutes);     // Enviar y ver resultados
 
// --- Ruta para 404 (no encontrada) ---
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'Ruta no encontrada',
  });
});
 
// --- Middleware de Manejo de Errores (Fallback) ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: err.message || 'Algo salió mal!',
  });
});
 
// --- Levantar servidor ---
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log("Modo desarrollo: 'npm run dev'");
});
