const express = require('express');
const {
  obtenerTodasLasTareas,
  crearNuevaTarea,
  eliminarTarea,
  actualizarTarea,
  alternarTareaCompletada,
  completarTodasLasTareas
} = require('../controllers/task.controller');

const router = express.Router();

router.get('/', obtenerTodasLasTareas);
router.post('/', crearNuevaTarea);
router.patch('/complete-all', completarTodasLasTareas);
router.patch('/:id/toggle', alternarTareaCompletada);
router.patch('/:id', actualizarTarea);
router.delete('/:id', eliminarTarea);

module.exports = router;