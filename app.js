// ELEMENTOS DEL DOM
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const categorySelect = document.getElementById("task-category");
const prioritySelect = document.getElementById("task-priority");
const taskList = document.getElementById("task-list");
const searchInput = document.getElementById("search-input");

// ARRAY DE TAREAS
let tasks = [];

/* ===== CARGAR TAREAS AL INICIAR ===== */
document.addEventListener("DOMContentLoaded", () => {
  const stored = localStorage.getItem("tasks");
  if (stored) {
    tasks = JSON.parse(stored).map(t => ({
      id: t.id || Date.now(),
      text: t.text || "",
      category: t.category || "trabajo",
      priority: t.priority || "medium",
      completed: t.completed || false
    }));
    tasks.forEach(task => renderTask(task));
  }
});

/* ===== AÑADIR TAREA ===== */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const newTask = {
    id: Date.now(),
    text: input.value.trim(),
    category: categorySelect.value,
    priority: prioritySelect.value,
    completed: false
  };

  tasks.push(newTask);
  renderTask(newTask);
  saveTasks();
  input.value = "";
});

/* ===== RENDERIZAR TAREA ===== */
function renderTask(task) {
  const div = document.createElement("div");
  div.classList.add("task", task.priority);
  div.dataset.category = task.category;
  div.dataset.id = task.id;

  if (task.completed) div.classList.add("completed");

  div.innerHTML = `
    <input type="checkbox" ${task.completed ? "checked" : ""}>
    <span class="title">${task.text}</span>
    <span class="category">${capitalize(task.category)}</span>
    <span class="priority">${priorityText(task.priority)}</span>
    <button class="delete-btn">❌</button>
  `;

  const checkbox = div.querySelector("input[type='checkbox']");
  const deleteBtn = div.querySelector(".delete-btn");

  // CLICK EN TODA LA TARJETA PARA COMPLETAR
  div.addEventListener("click", (e) => {
    if (e.target === deleteBtn) return; // no marcar si clic en borrar

    task.completed = !task.completed;
    checkbox.checked = task.completed;
    div.classList.toggle("completed");
    saveTasks();
  });

  // BORRAR TAREA
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // evitar marcar la tarea al borrar
    tasks = tasks.filter(t => t.id !== task.id);
    div.remove();
    saveTasks();
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
const filtros = document.querySelectorAll("aside li");

filtros.forEach(filtro => {
  filtro.addEventListener("click", () => {
    const categoria = filtro.dataset.filter;

    if (filtro.classList.contains("active")) {
      filtro.classList.remove("active");
      document.querySelectorAll(".task").forEach(t => t.style.display = "flex");
      return;
    }

    filtros.forEach(btn => btn.classList.remove("active"));
    filtro.classList.add("active");

    document.querySelectorAll(".task").forEach(tarea => {
      tarea.style.display = (categoria === "all" || tarea.dataset.category === categoria) ? "flex" : "none";
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