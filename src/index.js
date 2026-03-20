const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const loggerAcademico = require('./middlewares/logger.middleware');
const taskRoutes = require('./routes/task.routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(loggerAcademico);

// Servir frontend en local desde /public
app.use(express.static(path.join(__dirname, '..', 'public')));

// API
app.use('/api/v1/tasks', taskRoutes);

// Healthcheck opcional
app.get('/api/health', (req, res) => {
  res.status(200).json({ ok: true });
});

// Fallback para abrir la app en "/"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Middleware global de errores
app.use((err, req, res, next) => {
  if (err.message === 'NOT_FOUND') {
    return res.status(404).json({ error: 'La tarea no existe' });
  }

  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;