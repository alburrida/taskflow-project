const express = require('express');
const cors = require('cors');
const { PORT } = require('./config/env');
const loggerAcademico = require('./middlewares/logger.middleware');
const taskRoutes = require('./routes/task.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(loggerAcademico);

app.get('/', (req, res) => {
  res.json({ message: 'Backend de TaskFlow funcionando' });
});

app.use('/api/v1/tasks', taskRoutes);

app.use((err, req, res, next) => {
  if (err.message === 'NOT_FOUND') {
    return res.status(404).json({
      error: 'La tarea no existe'
    });
  }

  console.error(err);

  res.status(500).json({
    error: 'Error interno del servidor'
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});