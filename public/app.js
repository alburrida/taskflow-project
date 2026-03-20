// ===== ELEMENTOS DEL DOM =====
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const categorySelect = document.getElementById("task-category");
const prioritySelect = document.getElementById("task-priority");
const taskList = document.getElementById("task-list");
const searchInput = document.getElementById("search-input");
const formError = document.getElementById("form-error");
const pendingCounterEl = document.getElementById("counter-pending");
const completedCounterEl = document.getElementById("counter-completed");
const totalCounterEl = document.getElementById("counter-total");
const completeAllBtn = document.getElementById("complete-all-btn");
const networkStatus = document.getElementById("network-status");

// ===== ESTADO DE LA APLICACIÓN =====
let tasks = [];

// funciones auxiliares

function showLoading(message = "Cargando...") {
  if (!networkStatus) return;
  networkStatus.textContent = message;
  networkStatus.className = "text-sm px-3 py-2 rounded-xl bg-yellow-100 text-yellow-800 block";
}

function showError(message) {
  if (!networkStatus) return;
  networkStatus.textContent = message;
  networkStatus.className = "text-sm px-3 py-2 rounded-xl bg-red-100 text-red-700 block";
}

function hideStatus() {
  if (!networkStatus) return;
  networkStatus.textContent = "";
  networkStatus.className = "text-sm px-3 py-2 rounded-xl hidden";
}

async function loadTasksFromApi() {
  try {
    showLoading("Cargando tareas...");

    tasks = await window.taskApi.getTasks();
    renderTasks(tasks);
    updateCounters(tasks);
    applyCurrentFilters();
    updateCompleteAllButtonText();

    hideStatus();
  } catch (error) {
    console.error(error);
    showError(error.message || "No se pudieron cargar las tareas");
  }
}

function renderTasks(taskArray) {
  taskList.innerHTML = "";
  taskArray.forEach((task) => renderTask(task));
}

function replaceTaskInState(updatedTask) {
  tasks = tasks.map((task) =>
    task.id === updatedTask.id ? updatedTask : task
  );
}

function getCurrentCategoryFilter() {
  const selectedBtn = document.querySelector(".category-btn.selected");
  return selectedBtn ? selectedBtn.dataset.filter : "all";
}

function applyCurrentFilters() {
  const searchValue = searchInput.value.toLowerCase().trim();
  const currentCategory = getCurrentCategoryFilter();

  document.querySelectorAll(".task").forEach((taskEl) => {
    const titleEl = taskEl.querySelector(".title");
    const text = titleEl ? titleEl.textContent.toLowerCase() : "";

    const matchesSearch = text.includes(searchValue);
    const matchesCategory =
      currentCategory === "all" || taskEl.dataset.category === currentCategory;

    taskEl.style.display =
      matchesSearch && matchesCategory ? "flex" : "none";
  });
}

/* ===== DARK MODE ===== */

const themeToggle = document.getElementById("theme-toggle");

function updateThemeIcon() {
  if (!themeToggle) return;

  themeToggle.innerHTML = document.documentElement.classList.contains("dark")
    ? `<i class="fas fa-sun"></i>`
    : `<i class="fas fa-moon"></i>`;
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
document.addEventListener("DOMContentLoaded", async () => {
  await loadTasksFromApi();
});

/* ===== AÑADIR TAREA ===== */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = input.value.trim();

  if (!title) return;

  if (title.length < 3) {
    formError.textContent = "La tarea debe tener al menos 3 caracteres.";
    formError.classList.remove("opacity-0", "hidden");
    formError.classList.add("opacity-100");

    setTimeout(() => {
      formError.classList.remove("opacity-100");
      formError.classList.add("opacity-0");
    }, 2000);

    return;
  }

  try {
    showLoading("Guardando tarea...");

    const nuevaTarea = await window.taskApi.createTask({
      title,
      category: categorySelect.value,
      priority: prioritySelect.value,
    });

    tasks.push(nuevaTarea);
    renderTask(nuevaTarea);
    updateCounters(tasks);
    applyCurrentFilters();
    updateCompleteAllButtonText();
    showSuccess("Tarea creada correctamente");

    input.value = "";

    formError.classList.remove("opacity-100");
    formError.classList.add("opacity-0");
  } catch (error) {
    console.error(error);
    showError(error.message || "No se pudo crear la tarea");
  }
});

/* ===== CREAR ELEMENTO DE TAREA ===== */
function createTaskElement(task) {
  const div = document.createElement("div");

  div.classList.add(
    "task",
    "flex",
    "flex-col",
    "items-stretch",
    "md:flex-row",
    "md:items-center",
    "md:justify-between",
    "gap-3",
    "p-4",
    "rounded-xl",
    "bg-gray-50",
    "dark:bg-gray-700",
    "shadow-md",
    "hover:shadow-xl",
    "dark:hover:shadow-gray-900",
    "dark:hover:shadow-xl",
    "transition-shadow",
    "duration-300",
    "ease-in-out",
    "cursor-pointer",
    "w-full",
    "min-w-0",
    "overflow-hidden"
  );

  div.dataset.category = task.category;
  div.dataset.id = task.id;

  div.innerHTML = `
    <div class="flex-1 min-w-0 flex flex-col gap-2 w-full">
      <p class="title font-medium text-[#623229] dark:text-[#f8e9c9] break-words leading-relaxed min-w-0 w-full">
        ${task.title}
      </p>

      <div class="flex flex-wrap items-center gap-2 w-full">
        <span class="px-2 py-1 text-xs rounded-xl border flex items-center justify-center gap-1 transition-all duration-200 hover:scale-105 ${
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

        <span class="px-2 py-1 text-xs rounded-xl transition-colors duration-200 ${
          task.priority === "high"
            ? "bg-[#f19281] text-white"
            : task.priority === "medium"
            ? "bg-[#ff893b] text-white"
            : "bg-[#eaad88] text-[#623229]"
        }">
          ${priorityText(task.priority)}
        </span>
      </div>
    </div>

    <div class="flex w-full md:w-auto items-center justify-end gap-2 shrink-0">
      <button
        class="edit-btn px-2 py-1 text-xs rounded-xl text-[#623229] bg-transparent hover:bg-[#eaad88]/30 dark:text-[#f8e9c9] dark:hover:bg-[#623229]/30 transition-colors duration-200 flex items-center justify-center"
        type="button"
        aria-label="Editar tarea"
      >
        <i class="fa-solid fa-pen"></i>
      </button>

      <button
        class="delete-btn px-2 py-1 text-xs rounded-xl text-[#b47b6b] bg-transparent hover:bg-[#f19281]/30 dark:text-[#f8e9c9] dark:hover:bg-[#b47b6b]/30 transition-colors duration-200 flex items-center justify-center"
        type="button"
        aria-label="Eliminar tarea"
      >
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;

  updateTaskVisualState(task, div);

  return div;
}

/* ===== ACTUALIZAR ESTADO VISUAL DE LA TAREA ===== */
function updateTaskVisualState(task, div) {
  const isCompleted = task.completed;
  const titleEl = div.querySelector(".title");

  div.classList.toggle("opacity-50", isCompleted);
  div.classList.toggle("completed", isCompleted);

  if (isCompleted) {
    div.classList.add("bg-green-100", "dark:bg-green-700");

    if (titleEl) {
      titleEl.classList.add("line-through", "text-gray-500", "dark:text-gray-300");
    }
  } else {
    div.classList.remove("bg-green-100", "dark:bg-green-700");

    if (titleEl) {
      titleEl.classList.remove("line-through", "text-gray-500", "dark:text-gray-300");
    }
  }
}

/* ===== MODO EDICIÓN DE TAREA ===== */
/**
 * Activa el modo edición dentro de una tarjeta de tarea,
 * permitiendo cambiar texto, categoría y prioridad.
 *
 *@param {{ id: number|string, title: string, category: string, priority: string, completed: boolean }} task
 * @param {HTMLDivElement} div
 */
function enterEditMode(task, div) {
  if (div.classList.contains("editing")) return;
  div.classList.add("editing");

  div.innerHTML = "";
  div.className = [
    "task",
    "flex",
    "flex-col",
    "gap-3",
    "p-4",
    "rounded-xl",
    "bg-gray-50",
    "dark:bg-gray-700",
    "shadow-md",
    "w-full",
    "min-w-0"
  ].join(" ");

  const input = document.createElement("input");
  input.type = "text";
  input.value = task.title;
  input.classList.add(
    "w-full",
    "min-w-0",
    "px-3",
    "py-2",
    "rounded-lg",
    "border",
    "border-gray-300",
    "dark:border-gray-600",
    "bg-white",
    "dark:bg-gray-800",
    "text-[#623229]",
    "dark:text-[#f8e9c9]",
    "focus:ring-2",
    "focus:ring-indigo-300",
    "outline-none"
  );

  const controlsRow = document.createElement("div");
  controlsRow.classList.add(
    "flex",
    "flex-col",
    "sm:flex-row",
    "gap-2",
    "w-full"
  );

  const categorySelectEdit = document.createElement("select");
  categorySelectEdit.classList.add(
    "w-full",
    "sm:w-auto",
    "px-3",
    "py-2",
    "rounded-lg",
    "border",
    "border-gray-300",
    "dark:border-gray-600",
    "bg-white",
    "dark:bg-gray-800",
    "text-[#623229]",
    "dark:text-[#f8e9c9]"
  );

  ["trabajo", "hogar", "personal"].forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = capitalize(value);
    if (value === task.category) option.selected = true;
    categorySelectEdit.appendChild(option);
  });

  const prioritySelectEdit = document.createElement("select");
  prioritySelectEdit.classList.add(
    "w-full",
    "sm:w-auto",
    "px-3",
    "py-2",
    "rounded-lg",
    "border",
    "border-gray-300",
    "dark:border-gray-600",
    "bg-white",
    "dark:bg-gray-800",
    "text-[#623229]",
    "dark:text-[#f8e9c9]"
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

  controlsRow.appendChild(categorySelectEdit);
  controlsRow.appendChild(prioritySelectEdit);

  const buttonsRow = document.createElement("div");
  buttonsRow.classList.add(
    "flex",
    "flex-col",
    "sm:flex-row",
    "gap-2",
    "w-full",
    "sm:w-auto"
  );

  const saveBtn = document.createElement("button");
  saveBtn.type = "button";
  saveBtn.textContent = "Guardar";
  saveBtn.classList.add(
    "w-full",
    "sm:w-auto",
    "bg-green-500",
    "text-white",
    "px-3",
    "py-2",
    "rounded-lg",
    "text-sm",
    "hover:bg-green-600",
    "transition"
  );

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.textContent = "Cancelar";
  cancelBtn.classList.add(
    "w-full",
    "sm:w-auto",
    "bg-gray-300",
    "text-gray-800",
    "px-3",
    "py-2",
    "rounded-lg",
    "text-sm",
    "hover:bg-gray-400",
    "transition"
  );

  buttonsRow.appendChild(saveBtn);
  buttonsRow.appendChild(cancelBtn);

  div.appendChild(input);
  div.appendChild(controlsRow);
  div.appendChild(buttonsRow);

  saveBtn.addEventListener("click", async () => {
    const newTitle = input.value.trim();

    if (newTitle.length < 3) {
      alert("La tarea debe tener al menos 3 caracteres.");
      return;
    }

    try {
      showLoading("Actualizando tarea...");

      const tareaActualizada = await window.taskApi.updateTask(task.id, {
        title: newTitle,
        category: categorySelectEdit.value,
        priority: prioritySelectEdit.value,
      });

      replaceTaskInState(tareaActualizada);
      updateCounters(tasks);

      const newDiv = createTaskElement(tareaActualizada);
      attachTaskListeners(tareaActualizada, newDiv);
      taskList.replaceChild(newDiv, div);

      applyCurrentFilters();
      updateCompleteAllButtonText();
      showSuccess("Tarea actualizada correctamente");
    } catch (error) {
      console.error(error);
      showError(error.message || "No se pudo actualizar la tarea");
    }
  });

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

  div.addEventListener("click", async (e) => {
    if (e.target.closest(".delete-btn") || e.target.closest(".edit-btn")) {
      return;
    }

    if (div.classList.contains("editing")) return;

    try {
      const tareaActualizada = await window.taskApi.toggleTask(task.id);
      replaceTaskInState(tareaActualizada);
      task = tareaActualizada;

      updateTaskVisualState(tareaActualizada, div);
      updateCounters(tasks);
      applyCurrentFilters();
      updateCompleteAllButtonText();
      showSuccess(
        tareaActualizada.completed
          ? "Tarea marcada como completada"
          : "Tarea marcada como pendiente"
      );
    } catch (error) {
      console.error(error);
      showError(error.message || "No se pudo cambiar el estado de la tarea");
    }
  });

  if (editBtn) {
    editBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      enterEditMode(task, div);
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener("click", async (e) => {
      e.stopPropagation();

      try {
        showLoading("Eliminando tarea...");

        await window.taskApi.deleteTaskRequest(task.id);

        tasks = tasks.filter((t) => t.id !== task.id);
        div.remove();

        updateCounters(tasks);
        applyCurrentFilters();
        updateCompleteAllButtonText();
        showSuccess("Tarea eliminada correctamente");
      } catch (error) {
        console.error(error);
        showError(error.message || "No se pudo eliminar la tarea");
      }
    });
  }

  return div;
}

/* ===== RENDERIZAR TAREA ===== */
/**
 * Crea el elemento visual de una tarea, le añade listeners
 * y lo inserta en la lista de tareas del DOM.
 *
 * @param {{ id: number|string, title: string, category: string, priority: string, completed: boolean }} task *  Objeto de tarea a renderizar.
 */
function renderTask(task) {
  if (!taskList || !task) return;

  const taskElement = createTaskElement(task);
  attachTaskListeners(task, taskElement);
  taskList.appendChild(taskElement);
}



/* ===== BUSCADOR ===== */
searchInput.addEventListener("input", applyCurrentFilters);

/* ===== FILTRO POR CATEGORÍA ===== */
const filtros = document.querySelectorAll(".category-btn");

filtros.forEach((filtro) => {
  filtro.addEventListener("click", () => {
    filtros.forEach((btn) =>
      btn.classList.remove("selected", "shadow-inner", "translate-y-1")
    );

    filtro.classList.add("selected", "shadow-inner", "translate-y-1");
    applyCurrentFilters();
  });
});

function updateCompleteAllButtonText() {
  if (!completeAllBtn) return;

  const todasCompletadas =
    tasks.length > 0 && tasks.every((task) => task.completed);

  completeAllBtn.textContent = todasCompletadas
    ? "Desmarcar todas"
    : "Completar todas";
}

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

/* ===== CONTADORES ===== */
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
 * Alterna el estado de todas las tareas (completadas / pendientes)
 * consumiendo la API y actualizando la interfaz.
 */
async function completeAllTasks() {
  if (!tasks.length) return;

  try {
    showLoading("Actualizando todas las tareas...");

    const tareasActualizadas = await window.taskApi.completeAllTasksRequest();
    const todasCompletadas = tareasActualizadas.every((task) => task.completed);

    tasks = tareasActualizadas;

    renderTasks(tasks);
    updateCounters(tasks);
    applyCurrentFilters();
    updateCompleteAllButtonText();

    showSuccess(
      todasCompletadas
        ? "Todas las tareas se han completado"
        : "Todas las tareas se han marcado como pendientes"
    );
  } catch (error) {
    console.error(error);
    showError(error.message || "No se pudieron actualizar todas las tareas");
  }
}

if (completeAllBtn) {
  completeAllBtn.addEventListener("click", completeAllTasks);
}

function showSuccess(message = "Operación realizada correctamente") {
  if (!networkStatus) return;
  networkStatus.textContent = message;
  networkStatus.className = "text-sm px-3 py-2 rounded-xl bg-green-100 text-green-700 block";

  setTimeout(() => {
    hideStatus();
  }, 1500);
}