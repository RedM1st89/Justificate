const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ============================================
// MONGOOSE SCHEMAS & MODELS
// ============================================

// Schema para Alumnos
const alumnoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  matricula: { type: String, required: true, unique: true },
  programa: String,
  plan_estudios: String
}, { collection: 'alumnos' });

// Schema para Maestros
const maestroSchema = new mongoose.Schema({
  maestro_id: { type: String, required: true },
  nombre: { type: String, required: true },
  grupos: [String]
}, { collection: 'maestros' });

// Schema para Grupos
const grupoSchema = new mongoose.Schema({
  grupo_id: { type: String, required: true },
  maestro: {
    id: String,
    nombre: String,
    capacidad: Number,
    horario: String
  },
  materias: [{
    _id: false,
    materia: String
  }],
  alumnos: [{
    _id: false,
    no: Number,
    programa: String,
    plan_estudios: String,
    seccion: String,
    matricula: String,
    nombre: String,
    curso: String,
    materia: String
  }]
}, { collection: 'grupos' });

// Schema para Justificantes (nuevo)
const justificanteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  fecha_creacion: { type: Date, default: Date.now },
  alumnos: [{
    _id: false,
    matricula: { type: String, required: true },
    nombre: { type: String, required: true },
    clases: [{
      _id: false,
      id_clase: { type: String, required: true },
      fecha: { type: Date, required: true },
      hora: String
    }]
  }]
}, { collection: 'justificantes' });

// Models
const Alumno = mongoose.model('Alumno', alumnoSchema);
const Maestro = mongoose.model('Maestro', maestroSchema);
const Grupo = mongoose.model('Grupo', grupoSchema);
const Justificante = mongoose.model('Justificante', justificanteSchema);

// ============================================
// CONECTAR A MONGODB
// ============================================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB exitosamente');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error conectando a MongoDB:', err);
    process.exit(1);
  });

// ============================================
// RUTAS - ALUMNOS
// ============================================

// GET - Obtener todos los alumnos
app.get('/api/alumnos', async (req, res) => {
  try {
    const alumnos = await Alumno.find();
    res.json({
      success: true,
      count: alumnos.length,
      data: alumnos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET - Buscar alumno por matrícula
app.get('/api/alumnos/matricula/:matricula', async (req, res) => {
  try {
    const alumno = await Alumno.findOne({ matricula: req.params.matricula });
    if (!alumno) {
      return res.status(404).json({
        success: false,
        error: 'Alumno no encontrado'
      });
    }
    res.json({
      success: true,
      data: alumno
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET - Buscar alumnos por nombre (búsqueda parcial)
app.get('/api/alumnos/buscar/:nombre', async (req, res) => {
  try {
    const alumnos = await Alumno.find({
      nombre: { $regex: req.params.nombre, $options: 'i' }
    });
    res.json({
      success: true,
      count: alumnos.length,
      data: alumnos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST - Crear nuevo alumno
app.post('/api/alumnos', async (req, res) => {
  try {
    const nuevoAlumno = new Alumno(req.body);
    await nuevoAlumno.save();
    res.status(201).json({
      success: true,
      data: nuevoAlumno
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// RUTAS - MAESTROS
// ============================================

// GET - Obtener todos los maestros
app.get('/api/maestros', async (req, res) => {
  try {
    const maestros = await Maestro.find();
    res.json({
      success: true,
      count: maestros.length,
      data: maestros
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET - Buscar maestro por ID
app.get('/api/maestros/:maestro_id', async (req, res) => {
  try {
    const maestro = await Maestro.findOne({ maestro_id: req.params.maestro_id });
    if (!maestro) {
      return res.status(404).json({
        success: false,
        error: 'Maestro no encontrado'
      });
    }
    res.json({
      success: true,
      data: maestro
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// RUTAS - GRUPOS
// ============================================

// GET - Obtener todos los grupos
app.get('/api/grupos', async (req, res) => {
  try {
    const grupos = await Grupo.find();
    res.json({
      success: true,
      count: grupos.length,
      data: grupos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET - Buscar grupo por ID
app.get('/api/grupos/:grupo_id', async (req, res) => {
  try {
    const grupo = await Grupo.findOne({ grupo_id: req.params.grupo_id });
    if (!grupo) {
      return res.status(404).json({
        success: false,
        error: 'Grupo no encontrado'
      });
    }
    res.json({
      success: true,
      data: grupo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET - Buscar grupos por matrícula de alumno
app.get('/api/grupos/alumno/:matricula', async (req, res) => {
  try {
    const grupos = await Grupo.find({
      'alumnos.matricula': req.params.matricula
    });
    res.json({
      success: true,
      count: grupos.length,
      data: grupos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// RUTAS - JUSTIFICANTES
// ============================================

// GET - Obtener todos los justificantes
app.get('/api/justificantes', async (req, res) => {
  try {
    const justificantes = await Justificante.find().sort({ fecha_creacion: -1 });
    res.json({
      success: true,
      count: justificantes.length,
      data: justificantes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET - Obtener justificante por ID
app.get('/api/justificantes/:id', async (req, res) => {
  try {
    const justificante = await Justificante.findById(req.params.id);
    if (!justificante) {
      return res.status(404).json({
        success: false,
        error: 'Justificante no encontrado'
      });
    }
    res.json({
      success: true,
      data: justificante
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET - Buscar justificantes por matrícula de alumno
app.get('/api/justificantes/alumno/:matricula', async (req, res) => {
  try {
    const justificantes = await Justificante.find({
      'alumnos.matricula': req.params.matricula
    }).sort({ fecha_creacion: -1 });
    res.json({
      success: true,
      count: justificantes.length,
      data: justificantes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST - Crear nuevo justificante
app.post('/api/justificantes', async (req, res) => {
  try {
    const nuevoJustificante = new Justificante(req.body);
    await nuevoJustificante.save();
    res.status(201).json({
      success: true,
      message: 'Justificante creado exitosamente',
      data: nuevoJustificante
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// PUT - Actualizar justificante
app.put('/api/justificantes/:id', async (req, res) => {
  try {
    const justificante = await Justificante.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!justificante) {
      return res.status(404).json({
        success: false,
        error: 'Justificante no encontrado'
      });
    }
    res.json({
      success: true,
      message: 'Justificante actualizado exitosamente',
      data: justificante
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE - Eliminar justificante
app.delete('/api/justificantes/:id', async (req, res) => {
  try {
    const justificante = await Justificante.findByIdAndDelete(req.params.id);
    if (!justificante) {
      return res.status(404).json({
        success: false,
        error: 'Justificante no encontrado'
      });
    }
    res.json({
      success: true,
      message: 'Justificante eliminado exitosamente',
      data: justificante
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// RUTA RAÍZ - INFO DE LA API
// ============================================
app.get('/', (req, res) => {
  res.json({
    message: 'API de Justificantes - Sistema de Gestión Escolar',
    version: '1.0.0',
    endpoints: {
      alumnos: {
        'GET /api/alumnos': 'Obtener todos los alumnos',
        'GET /api/alumnos/matricula/:matricula': 'Buscar alumno por matrícula',
        'GET /api/alumnos/buscar/:nombre': 'Buscar alumnos por nombre',
        'POST /api/alumnos': 'Crear nuevo alumno'
      },
      maestros: {
        'GET /api/maestros': 'Obtener todos los maestros',
        'GET /api/maestros/:maestro_id': 'Buscar maestro por ID'
      },
      grupos: {
        'GET /api/grupos': 'Obtener todos los grupos',
        'GET /api/grupos/:grupo_id': 'Buscar grupo por ID',
        'GET /api/grupos/alumno/:matricula': 'Buscar grupos de un alumno'
      },
      justificantes: {
        'GET /api/justificantes': 'Obtener todos los justificantes',
        'GET /api/justificantes/:id': 'Obtener justificante por ID',
        'GET /api/justificantes/alumno/:matricula': 'Buscar justificantes de un alumno',
        'POST /api/justificantes': 'Crear nuevo justificante',
        'PUT /api/justificantes/:id': 'Actualizar justificante',
        'DELETE /api/justificantes/:id': 'Eliminar justificante'
      }
    }
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada'
  });
});