// ELEMENTOS DEL DOM
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const categorySelect = document.getElementById("task-category");
const prioritySelect = document.getElementById("task-priority");
const taskList = document.getElementById("task-list");
const searchInput = document.getElementById("search-input");
const counter = document.getElementById("task-counter");

// ARRAY DE TAREAS
let tasks = [];

/* ===== DARK MODE ===== */

const themeToggle = document.getElementById("theme-toggle");

function updateThemeIcon() {
  if (document.documentElement.classList.contains("dark")) {
    themeToggle.textContent = "☀️";
  } else {
    themeToggle.textContent = "🌙";
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

/* actualizar icono al cargar */
updateThemeIcon();

/* ===== CARGAR TAREAS AL INICIAR ===== */
document.addEventListener("DOMContentLoaded", () => {
  const stored = localStorage.getItem("tasks");
  if (stored) {
    tasks = JSON.parse(stored);
    tasks.forEach(task => renderTask(task));
  }
  updateCounter();
});

/* ===== AÑADIR TAREA ===== */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  const newTask = {
    id: Date.now(),
    text,
    category: categorySelect.value,
    priority: prioritySelect.value,
    completed: false
  };

  tasks.push(newTask);
  renderTask(newTask);
  saveTasks();
  updateCounter();
  input.value = "";
});

/* ===== RENDERIZAR TAREA ===== */
function renderTask(task) {
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
    "shadow-md",
    "hover:shadow-xl",
    "transition-shadow",
    "duration-300",
    "ease-in-out",
    "cursor-pointer",
    "flex-wrap",
    "gap-2"
  );


  div.dataset.category = task.category;
  div.dataset.id = task.id;

  div.innerHTML = `
    <p class="flex-1 font-medium text-gray-800 dark:text-gray-100 title">${task.text}</p>

    <span class="px-2 py-1 text-xs rounded-full text-white transition-colors duration-200 ${
      task.category === "trabajo"
        ? "bg-purple-400 hover:bg-purple-500 dark:bg-purple-600 dark:hover:bg-purple-500"
        : task.category === "hogar"
        ? "bg-pink-300 hover:bg-pink-400 dark:bg-pink-600 dark:hover:bg-pink-500"
        : "bg-indigo-300 hover:bg-indigo-400 dark:bg-indigo-600 dark:hover:bg-indigo-500" // personal
}">
      ${capitalize(task.category)}
    </span>

    <span class="px-2 py-1 text-xs rounded-full text-white transition-colors duration-200 ${
      task.priority === "high"
        ? "bg-red-300 hover:bg-red-400 dark:bg-red-600 dark:hover:bg-red-500"
        : task.priority === "medium"
        ? "bg-yellow-300 hover:bg-yellow-400 dark:bg-yellow-600 dark:hover:bg-yellow-500"
        : "bg-green-300 hover:bg-green-400 dark:bg-green-600 dark:hover:bg-green-500"
    }">
      ${priorityText(task.priority)}
    </span>

    <button class="delete-btn text-sm hover:scale-110 transition-transform duration-200 ml-2">❌</button>
  `;

  const deleteBtn = div.querySelector(".delete-btn");

  // Click en toda la tarjeta para marcar completada
  div.addEventListener("click", (e) => {
    if (e.target === deleteBtn) return;

    task.completed = !task.completed;
    div.classList.toggle("opacity-50");
    div.classList.toggle("completed");

    if (task.completed) {
      div.classList.add("bg-green-100", "dark:bg-green-700", "line-through", "text-gray-500");
    } else {
      div.classList.remove("bg-green-100", "dark:bg-green-700", "line-through", "text-gray-500");
    }

    saveTasks();
    updateCounter();
  });

  // Borrar tarea
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    tasks = tasks.filter(t => t.id !== task.id);
    div.remove();
    saveTasks();
    updateCounter();
  });

  taskList.appendChild(div);
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

/* ===== CONTADOR ===== */
function updateCounter() {
  if (!counter) return;
  const pending = tasks.filter(t => !t.completed).length;
  counter.textContent = `Tareas pendientes: ${pending}`;
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