// ===== ELEMENTOS DEL DOM =====
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const categorySelect = document.getElementById("task-category");
const prioritySelect = document.getElementById("task-priority");
const taskList = document.getElementById("task-list");
const searchInput = document.getElementById("search-input");
const counter = document.getElementById("task-counter");
const formError = document.getElementById("form-error");
const pendingCounterEl = document.getElementById("counter-pending");
const completedCounterEl = document.getElementById("counter-completed");
const totalCounterEl = document.getElementById("counter-total");
const completeAllBtn = document.getElementById("complete-all-btn");

// ===== ESTADO DE LA APLICACIÓN =====
let tasks = [];

/* ===== DARK MODE ===== */

const themeToggle = document.getElementById("theme-toggle");

function updateThemeIcon() {
  const themeToggle = document.getElementById("theme-toggle");
  // Limpiamos cualquier icono anterior
  themeToggle.innerHTML = "";
  
  if (document.documentElement.classList.contains("dark")) {
    // Mostrar icono de sol en modo oscuro
    themeToggle.innerHTML = `<i class="fas fa-sun"></i>`;
  } else {
    // Mostrar icono de luna en modo claro
    themeToggle.innerHTML = `<i class="fas fa-moon"></i>`;
  }
}

themeToggle.addEventListener("click", () => {
  const html = document.documentElement;

  html.classList.toggle("dark");

  if (html.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }

  updateThemeIcon();
});

// Actualizar icono al cargar
updateThemeIcon();

/* ===== CARGAR TAREAS AL INICIAR ===== */
document.addEventListener("DOMContentLoaded", () => {
  const stored = localStorage.getItem("tasks");

  if (stored) {
    tasks = JSON.parse(stored);
    tasks.forEach((task) => renderTask(task));
  }

  updateCounters(tasks);
});


/* ===== AÑADIR TAREA ===== */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = input.value.trim();

  // Validación de texto
  if (!text) return;
  if (text.length < 3) {
    formError.textContent = "La tarea debe tener al menos 3 caracteres.";

    // Mostrar con fade-in
    formError.classList.remove("opacity-0");
    formError.classList.add("opacity-100");

    // Desaparece automáticamente después de 2 segundos
    setTimeout(() => {
      formError.classList.remove("opacity-100");
      formError.classList.add("opacity-0");
    }, 2000);

    return;
  }

  // ocultamos mensaje
  formError.classList.add("opacity-0");
  setTimeout(() => formError.classList.add("hidden"), 200);

  const newTask = {
    id: Date.now(),
    text,
    category: categorySelect.value,
    priority: prioritySelect.value,
    completed: false,
  };

  tasks.push(newTask);
  renderTask(newTask);
  updateCounters(tasks);
  saveTasks();
  input.value = "";
});

/* ===== CREAR ELEMENTO DE TAREA ===== */
function createTaskElement(task) {
  const div = document.createElement("div");

  div.classList.add(
    "task",
    "flex",
    "justify-between",
    "items-center",
    "p-4",
    "rounded-xl",
    "bg-gray-50",
    "dark:bg-gray-700",
    "dark:hover:shadow-gray-900", 
    "dark:hover:shadow-xl",
    "shadow-md",
    "hover:shadow-xl",
    "transition-shadow",
    "duration-300",
    "ease-in-out",
    "cursor-pointer",
    "flex-wrap",
    "gap-2",
  );

  
  div.dataset.category = task.category;
  div.dataset.id = task.id;

  div.innerHTML = `
    <p class="flex-1 font-medium text-[#623229] dark:text-[#f8e9c9] title rounded-xl mx-2">
      ${task.text}
    </p>

    <!-- Chip de categoría -->
    <span class="px-2 py-1 text-xs rounded-xl border flex items-center justify-center gap-1 mx-1 transition-all duration-200 hover:scale-105 ${
      task.category === "trabajo"
        ? "bg-[#ff893b] border-[#ff893b] text-white dark:bg-[#ff893b] dark:border-[#ff893b]"
        : task.category === "hogar"
        ? "bg-[#eaad88] border-[#eaad88] text-[#623229] dark:bg-[#b47b6b] dark:border-[#b47b6b] dark:text-[#f8e9c9]"
        : task.category === "personal"
        ? "bg-[#f19281] border-[#f19281] text-white dark:bg-[#f19281] dark:border-[#f19281]"
        : "bg-[#b47b6b] border-[#b47b6b] text-white dark:bg-[#623229] dark:border-[#623229]"
    }">
      ${capitalize(task.category)}
    </span>

    <!-- Chip de prioridad -->
    <span class="px-2 py-1 text-xs rounded-xl transition-colors duration-200 mx-1 ${
      task.priority === "high"
        ? "bg-[#f19281] text-white"
        : task.priority === "medium"
        ? "bg-[#ff893b] text-white"
        : "bg-[#eaad88] text-[#623229]"
    }">
      ${priorityText(task.priority)}
    </span>

    <button
      class="edit-btn px-2 py-1 text-xs rounded-xl text-[#623229] bg-transparent hover:bg-[#eaad88]/30 dark:text-[#f8e9c9] dark:hover:bg-[#623229]/30 transition-colors duration-200 mx-1 flex items-center justify-center"
      type="button"
      aria-label="Editar tarea"
    >
      <i class="fa-solid fa-pen"></i>
    </button>

    <button
      class="delete-btn px-2 py-1 text-xs rounded-xl text-[#b47b6b] bg-transparent hover:bg-[#f19281]/30 dark:text-[#f8e9c9] dark:hover:bg-[#b47b6b]/30 transition-colors duration-200 mx-1 flex items-center justify-center"
      type="button"
      aria-label="Eliminar tarea"
    >
      <i class="fas fa-trash"></i>
    </button>
  `;

  // Aplicar estado visual inicial según si la tarea está completada
  updateTaskVisualState(task, div);

  return div;
}

/* ===== ACTUALIZAR ESTADO VISUAL DE LA TAREA ===== */
function updateTaskVisualState(task, div) {
  const isCompleted = task.completed;

  div.classList.toggle("opacity-50", isCompleted);
  div.classList.toggle("completed", isCompleted);

  if (isCompleted) {
    div.classList.add(
      "bg-green-100",
      "dark:bg-green-700",
      "line-through",
      "text-gray-500",
    );
  } else {
    div.classList.remove(
      "bg-green-100",
      "dark:bg-green-700",
      "line-through",
      "text-gray-500",
    );
  }
}

/* ===== MODO EDICIÓN DE TAREA ===== */
/**
 * Activa el modo edición dentro de una tarjeta de tarea,
 * permitiendo cambiar texto, categoría y prioridad.
 *
 * @param {{ id: number|string, text: string, category: string, priority: string, completed: boolean }} task
 * @param {HTMLDivElement} div
 */
function enterEditMode(task, div) {
  // Evitar entrar dos veces en modo edición
  if (div.classList.contains("editing")) return;
  div.classList.add("editing");

  // Limpiar contenido actual
  div.innerHTML = "";

  // Campo de texto
  const input = document.createElement("input");
  input.type = "text";
  input.value = task.text;
  input.classList.add(
    "flex-1",
    "px-3",
    "py-1",
    "rounded-lg",
    "border",
    "border-gray-300",
    "focus:ring-2",
    "focus:ring-indigo-300",
    "outline-none",
  );

  // Select de categoría
  const categorySelectEdit = document.createElement("select");
  categorySelectEdit.classList.add(
    "px-2",
    "py-1",
    "rounded-lg",
    "border",
    "border-gray-300",
  );

  ["trabajo", "hogar", "personal"].forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = capitalize(value);
    if (value === task.category) option.selected = true;
    categorySelectEdit.appendChild(option);
  });

  // Select de prioridad
  const prioritySelectEdit = document.createElement("select");
  prioritySelectEdit.classList.add(
    "px-2",
    "py-1",
    "rounded-lg",
    "border",
    "border-gray-300",
  );

  [
    { value: "high", label: "Alta" },
    { value: "medium", label: "Media" },
    { value: "low", label: "Baja" },
  ].forEach(({ value, label }) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    if (value === task.priority) option.selected = true;
    prioritySelectEdit.appendChild(option);
  });

  // Botón guardar
  const saveBtn = document.createElement("button");
  saveBtn.type = "button";
  saveBtn.textContent = "Guardar";
  saveBtn.classList.add(
    "bg-green-500",
    "text-white",
    "px-3",
    "py-1",
    "rounded-lg",
    "ml-2",
    "text-sm",
    "hover:bg-green-600",
    "transition",
  );

  // Botón cancelar
  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.textContent = "Cancelar";
  cancelBtn.classList.add(
    "bg-gray-300",
    "text-gray-800",
    "px-3",
    "py-1",
    "rounded-lg",
    "ml-2",
    "text-sm",
    "hover:bg-gray-400",
    "transition",
  );

  // Montar modo edición
  div.appendChild(input);
  div.appendChild(categorySelectEdit);
  div.appendChild(prioritySelectEdit);
  div.appendChild(saveBtn);
  div.appendChild(cancelBtn);

  // Guardar cambios
  saveBtn.addEventListener("click", () => {
    const newText = input.value.trim();
    if (newText.length < 3) {
      // Reutilizamos la misma validación básica que el formulario principal
      alert("La tarea debe tener al menos 3 caracteres.");
      return;
    }

    task.text = newText;
    task.category = categorySelectEdit.value;
    task.priority = prioritySelectEdit.value;

    saveTasks();
    updateCounters(tasks);

    // Re-renderizar la tarjeta completa con los nuevos datos
    const newDiv = createTaskElement(task);
    attachTaskListeners(task, newDiv);
    taskList.replaceChild(newDiv, div);
  });

  // Cancelar edición
  cancelBtn.addEventListener("click", () => {
    const newDiv = createTaskElement(task);
    attachTaskListeners(task, newDiv);
    taskList.replaceChild(newDiv, div);
  });
}

/* ===== AÑADIR LISTENERS A LA TAREA ===== */
function attachTaskListeners(task, div) {
  const deleteBtn = div.querySelector(".delete-btn");
  const editBtn = div.querySelector(".edit-btn");

  // Click en toda la tarjeta para marcar completada
  div.addEventListener("click", (e) => {
    // No hacer nada si el click viene de los botones
    if (e.target === deleteBtn || e.target === editBtn) return;
    // Ni si la tarjeta está en modo edición
    if (div.classList.contains("editing")) return;

    task.completed = !task.completed;
    updateTaskVisualState(task, div);

    saveTasks();
    updateCounters(tasks);
  });

  // Editar tarea
  if (editBtn) {
    editBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      enterEditMode(task, div);
    });
  }

  // Borrar tarea
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    tasks = tasks.filter((t) => t.id !== task.id);
    div.remove();
    saveTasks();
    updateCounters(tasks);
  });

  return div;
}

/* ===== RENDERIZAR TAREA ===== */
/**
 * Crea el elemento visual de una tarea, le añade listeners
 * y lo inserta en la lista de tareas del DOM.
 *
 * @param {{ id: number|string, text: string, category: string, priority: string, completed: boolean }} task
 *  Objeto de tarea a renderizar.
 */
function renderTask(task) {
  if (!taskList || !task) return;

  const taskElement = createTaskElement(task);
  attachTaskListeners(task, taskElement);
  taskList.appendChild(taskElement);
}

/* ===== GUARDAR EN LOCALSTORAGE ===== */
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* ===== BUSCADOR ===== */
searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  document.querySelectorAll(".task").forEach(task => {
    const text = task.querySelector(".title").textContent.toLowerCase();
    task.style.display = text.includes(value) ? "flex" : "none";
  });
});

/* ===== FILTRO POR CATEGORÍA ===== */
const filtros = document.querySelectorAll(".category-btn");

filtros.forEach(filtro => {
  filtro.addEventListener("click", () => {
    const categoria = filtro.dataset.filter;

    // Quitar clase selected de todos
    filtros.forEach(btn => btn.classList.remove("selected", "shadow-inner", "translate-y-1"));

    // Marcar el botón actual como seleccionado y simular hundido
    filtro.classList.add("selected", "shadow-inner", "translate-y-1");

    // Mostrar/ocultar tareas
    document.querySelectorAll(".task").forEach(tarea => {
      tarea.style.display =
        categoria === "all" || tarea.dataset.category === categoria ? "flex" : "none";
    });
  });
});


/* ===== HELPERS ===== */
function capitalize(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}
function priorityText(priority) {
  if (priority === "high") return "Alta";
  if (priority === "medium") return "Media";
  return "Baja";
}

/* ===== CONTADOR REFACTORIZADO ===== */
/**
 * Actualiza los contadores de tareas en la interfaz:
 * pendientes, completadas y totales.
 *
 * @param {{ completed: boolean }[]} tasks - Lista de tareas.
 */
function updateCounters(tasks) {
  if (!pendingCounterEl || !completedCounterEl || !totalCounterEl) return;

  let pending = 0;
  let completed = 0;

  for (const task of tasks) {
    if (task.completed) {
      completed += 1;
    } else {
      pending += 1;
    }
  }

  const total = pending + completed;

  pendingCounterEl.textContent = `Pendientes: ${pending}`;
  completedCounterEl.textContent = `Completadas: ${completed}`;
  totalCounterEl.textContent = `Total: ${total}`;
}

/* ===== ACCIONES GLOBALES ===== */
/**
 * Alterna el estado de todas las tareas (completadas / pendientes),
 * actualizando estado interno, UI y almacenamiento en localStorage.
 */
function completeAllTasks() {
  if (!tasks.length) return;

  // Si todas están completadas, las marcamos como pendientes; si no, las completamos todas
  const allCompleted = tasks.every((task) => task.completed);
  const newCompletedState = !allCompleted;

  tasks.forEach((task) => {
    task.completed = newCompletedState;
  });

  document.querySelectorAll(".task").forEach((taskEl) => {
    const id = taskEl.dataset.id;
    const task = tasks.find((t) => String(t.id) === String(id));
    if (task) {
      updateTaskVisualState(task, taskEl);
    }
  });

  saveTasks();
  updateCounters(tasks);
}

if (completeAllBtn) {
  completeAllBtn.addEventListener("click", completeAllTasks);
}
