let tasks = [];
let nextId = 1;

const obtenerTodas = () => {
  return tasks;
};

const crearTarea = (data) => {
  const nuevaTarea = {
    id: nextId++,
    title: data.title,
    category: data.category,
    priority: data.priority,
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(nuevaTarea);
  return nuevaTarea;
};

const eliminarTarea = (id) => {
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    throw new Error('NOT_FOUND');
  }

  tasks.splice(index, 1);
};

const actualizarTarea = (id, data) => {
  const task = tasks.find((task) => task.id === id);

  if (!task) {
    throw new Error('NOT_FOUND');
  }

  if (data.title !== undefined) {
    task.title = data.title;
  }

  if (data.category !== undefined) {
    task.category = data.category;
  }

  if (data.priority !== undefined) {
    task.priority = data.priority;
  }

  return task;
};

const alternarCompletada = (id) => {
  const task = tasks.find((task) => task.id === id);

  if (!task) {
    throw new Error('NOT_FOUND');
  }

  task.completed = !task.completed;
  return task;
};

const completarTodas = () => {
  const todasCompletadas = tasks.length > 0 && tasks.every((task) => task.completed);

  tasks = tasks.map((task) => ({
    ...task,
    completed: !todasCompletadas
  }));

  return tasks;
};

module.exports = {
  obtenerTodas,
  crearTarea,
  eliminarTarea,
  actualizarTarea,
  alternarCompletada,
  completarTodas
};