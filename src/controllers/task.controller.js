const taskService = require('../services/task.service');

const obtenerTodasLasTareas = (req, res) => {
  const tasks = taskService.obtenerTodas();
  res.status(200).json(tasks);
};

const crearNuevaTarea = (req, res) => {
  const { title, category, priority } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    return res.status(400).json({
      error: 'El título es obligatorio y debe tener al menos 3 caracteres'
    });
  }

  if (!category || typeof category !== 'string') {
    return res.status(400).json({
      error: 'La categoría es obligatoria'
    });
  }

  if (!priority || typeof priority !== 'string') {
    return res.status(400).json({
      error: 'La prioridad es obligatoria'
    });
  }

  const nuevaTarea = taskService.crearTarea({
    title: title.trim(),
    category: category.trim(),
    priority: priority.trim()
  });

  res.status(201).json(nuevaTarea);
};

const eliminarTarea = (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: 'El id debe ser un número entero positivo'
      });
    }

    taskService.eliminarTarea(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const actualizarTarea = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { title, category, priority } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: 'El id debe ser un número entero positivo'
      });
    }

    if (
      title === undefined &&
      category === undefined &&
      priority === undefined
    ) {
      return res.status(400).json({
        error: 'Debes enviar al menos un campo para actualizar'
      });
    }

    const data = {};

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length < 3) {
        return res.status(400).json({
          error: 'El título debe tener al menos 3 caracteres'
        });
      }
      data.title = title.trim();
    }

    if (category !== undefined) {
      if (typeof category !== 'string' || !category.trim()) {
        return res.status(400).json({
          error: 'La categoría no es válida'
        });
      }
      data.category = category.trim();
    }

    if (priority !== undefined) {
      if (typeof priority !== 'string' || !priority.trim()) {
        return res.status(400).json({
          error: 'La prioridad no es válida'
        });
      }
      data.priority = priority.trim();
    }

    const tareaActualizada = taskService.actualizarTarea(id, data);
    res.status(200).json(tareaActualizada);
  } catch (error) {
    next(error);
  }
};

const alternarTareaCompletada = (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: 'El id debe ser un número entero positivo'
      });
    }

    const tareaActualizada = taskService.alternarCompletada(id);
    res.status(200).json(tareaActualizada);
  } catch (error) {
    next(error);
  }
};

const completarTodasLasTareas = (req, res) => {
  const tareasActualizadas = taskService.completarTodas();
  res.status(200).json(tareasActualizadas);
};

module.exports = {
  obtenerTodasLasTareas,
  crearNuevaTarea,
  eliminarTarea,
  actualizarTarea,
  alternarTareaCompletada,
  completarTodasLasTareas
};