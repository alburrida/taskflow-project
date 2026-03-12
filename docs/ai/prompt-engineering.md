# Prompt Engineering

## Propósito del documento

Este documento explica las técnicas de prompt engineering utilizadas al interactuar con asistentes de inteligencia artificial durante el desarrollo del proyecto TaskFlow.

Se incluirán:

- Ejemplos de prompts utilizados
- Estrategias para obtener mejores respuestas
- Refinamiento iterativo de prompts
- Uso de prompts para depurar código
- Uso de prompts para generar documentación o mejorar la arquitectura del proyecto

## 1. Actúa como un desarrollador senior

Actúa como un desarrollador senior experto en JavaScript y buenas prácticas de front-end. 
Revisa la siguiente función y sugiere mejoras en legibilidad, modularidad y rendimiento. 
Explica paso a paso cada cambio que propones. 

Función:

function renderTask(task) {
  const div = document.createElement("div");
  div.classList.add("task", "flex", "justify-between");
  div.dataset.id = task.id;
  div.innerHTML = `<p>${task.text}</p><button>❌</button>`;
  taskList.appendChild(div);
}

# Refactorización de `renderTask`

## Problemas originales
- Uso de `innerHTML` → riesgo de inyección y difícil de leer.  
- Mezcla creación del DOM y comportamiento.  
- Nombres poco descriptivos (`div`).  
- Botón ❌ sin accesibilidad (`type`, `aria-label`).  

## Mejoras aplicadas
1. **Renombrar variables**: `taskEl`, `textEl`, `deleteButton`.  
2. **Crear nodos con `createElement`** en lugar de `innerHTML`.  
3. **Funciones auxiliares**:
   - `createTaskElement(task)` → crea la estructura de la tarjeta.  
   - `createDeleteButton()` → botón de borrar reutilizable.  
4. **Separación de responsabilidades**: renderizado vs listeners.  
5. **Accesibilidad**: `type="button"`, `aria-label`.  
6. **Preparado para rendimiento**: opcional `DocumentFragment` si se renderizan muchas tareas.  

## Ventajas
- Legible y mantenible.  
- Más seguro ante contenido del usuario.  
- Modular y fácil de testear o extender.  
- Comportamiento y estilo desacoplados del HTML.  

**Por qué funciona:**  
Define claramente el rol de la IA, lo que hace que la revisión sea más detallada y experta.

## 2. Few-shot con ejemplo de entrada y salida

**Prompt:**
> Dada esta función:
> 
> ```js
> function sum(a,b){return a+b;}
> ```
> Reescríbela usando buenas prácticas, incluyendo tipado JSDoc y manejo de errores. Ejemplo de entrada: `sum(2,3)` → salida esperada: `5`.

Versión mejorada de sum con JSDoc y validaciones
/**
 * Suma dos números.
 *
 * @param {number} a - Primer sumando. Debe ser un número finito.
 * @param {number} b - Segundo sumando. Debe ser un número finito.
 * @returns {number} Resultado de la suma de `a` y `b`.
 * @throws {TypeError} Si alguno de los argumentos no es un número.
 */
function sum(a, b) {
  if (typeof a !== "number" || Number.isNaN(a) || !Number.isFinite(a)) {
    throw new TypeError(`El parámetro "a" debe ser un número finito. Valor recibido: ${a}`);
  }
  if (typeof b !== "number" || Number.isNaN(b) || !Number.isFinite(b)) {
    throw new TypeError(`El parámetro "b" debe ser un número finito. Valor recibido: ${b}`);
  }
  return a + b;
}
Ejemplo: sum(2, 3) devuelve 5; sum("2", 3) lanza un TypeError.

**Por qué funciona:**  
El ejemplo guía a la IA sobre formato y estilo esperado.

---

## 3. Paso a paso
**Prompt:**
> Analiza esta función y explica paso a paso qué hace cada línea y cómo se podría optimizar:

```js
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
```
function saveTasks() {
Declara una función llamada saveTasks sin parámetros. Se usará para guardar el estado actual de las tareas.

localStorage.setItem("tasks", JSON.stringify(tasks));

JSON.stringify(tasks): convierte el array/objeto tasks (estructura JS) en una cadena JSON.
localStorage.setItem("tasks", ...): guarda esa cadena en el localStorage del navegador bajo la clave "tasks".
Así, al recargar la página se pueden recuperar las tareas con localStorage.getItem("tasks") + JSON.parse.
}
Cierra la función.

Posibles mejoras / optimizaciones
Manejo básico de errores (por si localStorage falla o el objeto no es serializable):

```js

function saveTasks() {
  try {
    const serialized = JSON.stringify(tasks);
    localStorage.setItem("tasks", serialized);
  } catch (error) {
    console.error("Error al guardar tareas en localStorage:", error);
  }
}

```

**Por qué funciona:**  
Fuerza a la IA a descomponer la lógica en pasos claros, útil para aprendizaje y documentación.

---

## 4. Restricciones de formato
**Prompt:**
> Reescribe esta función respetando estas condiciones: usar `const`/`let`, sin `var`, máximo 20 líneas, e incluir comentarios JSDoc.

```js
function addTask() {
  var text = document.getElementById("task-input").value;
  if(text.length < 3){ alert("Muy corto"); return; }
  tasks.push({ text: text, completed: false });
  renderTask(tasks[tasks.length-1]);
}
```
Función reescrita:

```js
/**
 * Añade una nueva tarea a la lista y la renderiza.
 * Lee el texto del input, valida longitud mínima y actualiza el array global `tasks`.
 */
function addTask() {
  const input = document.getElementById("task-input");
  const text = input.value.trim();

  if (text.length < 3) {
    alert("La tarea debe tener al menos 3 caracteres.");
    return;
  }

  const newTask = {
    text,
    completed: false,
  };

  tasks.push(newTask);
  renderTask(newTask);
  input.value = "";
}
```

**Por qué funciona:**  
Las restricciones guían la salida para cumplir normas de estilo o límites específicos del proyecto.

---

## 5. Generación de tests automáticos
**Prompt:**
> Crea 3 pruebas unitarias en Jest para la siguiente función:

```js
// tasks.js
/**
 * Filtra tareas activas (no completadas) de un array de tareas.
 * @param {Array} tasks - Array de tareas, cada una con { text, completed }
 * @returns {Array} - Solo las tareas activas
 */
function getActiveTasks(tasks) {
  return tasks.filter(task => !task.completed);
}

module.exports = { getActiveTasks };
```
```js
Aquí tienes 3 pruebas unitarias en Jest para getActiveTasks:


// tasks.test.js
const { getActiveTasks } = require("./tasks");
describe("getActiveTasks", () => {
  test("devuelve solo tareas no completadas", () => {
    const tasks = [
      { text: "Tarea 1", completed: false },
      { text: "Tarea 2", completed: true },
      { text: "Tarea 3", completed: false },
    ];
    const result = getActiveTasks(tasks);
    expect(result).toEqual([
      { text: "Tarea 1", completed: false },
      { text: "Tarea 3", completed: false },
    ]);
  });
  test("devuelve un array vacío si todas las tareas están completadas", () => {
    const tasks = [
      { text: "Tarea 1", completed: true },
      { text: "Tarea 2", completed: true },
    ];
    const result = getActiveTasks(tasks);
    expect(result).toEqual([]);
  });
  test("no muta el array original de tareas", () => {
    const tasks = [
      { text: "Tarea 1", completed: false },
      { text: "Tarea 2", completed: true },
    ];
    const copyBefore = [...tasks];
    getActiveTasks(tasks);
    expect(tasks).toEqual(copyBefore);
  });
});
```


**Por qué funciona:**  
Permite obtener tests listos para integrar, acelerando la verificación del código.

---

## 6. Refactorización modular
**Prompt:**
> Refactoriza esta función larga en funciones más pequeñas, cada una con responsabilidad única y nombre descriptivo.

````js
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
    <p class="flex-1 font-medium text-gray-800 dark:text-gray-100 title">
      ${task.text}
    </p>

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

    <button class="delete-btn text-sm hover:scale-110 transition-transform duration-200 ml-2">
      ❌
    </button>
  `;

  return div;
}
```
```js

Refactor propuesta de createTaskElement
function createTaskElement(task) {
  const taskEl = createTaskContainer(task);
  taskEl.innerHTML = buildTaskInnerHTML(task);
  return taskEl;
}
function createTaskContainer(task) {
  const taskEl = document.createElement("div");
  taskEl.classList.add(
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
  taskEl.dataset.category = task.category;
  taskEl.dataset.id = task.id;
  return taskEl;
}
function buildTaskInnerHTML(task) {
  const categoryClasses = getCategoryClasses(task.category);
  const priorityClasses = getPriorityClasses(task.priority);
  return `
    <p class="flex-1 font-medium text-gray-800 dark:text-gray-100 title">
      ${task.text}
    </p>
    <span class="px-2 py-1 text-xs rounded-full text-white transition-colors duration-200 ${categoryClasses}">
      ${capitalize(task.category)}
    </span>
    <span class="px-2 py-1 text-xs rounded-full text-white transition-colors duration-200 ${priorityClasses}">
      ${priorityText(task.priority)}
    </span>
    <button class="delete-btn text-sm hover:scale-110 transition-transform duration-200 ml-2">
      ❌
    </button>
   `;
}
function getCategoryClasses(category) {
  if (category === "trabajo") {
    return "bg-purple-400 hover:bg-purple-500 dark:bg-purple-600 dark:hover:bg-purple-500";
  }
  if (category === "hogar") {
    return "bg-pink-300 hover:bg-pink-400 dark:bg-pink-600 dark:hover:bg-pink-500";
  }
  // personal (u otras)
  return "bg-indigo-300 hover:bg-indigo-400 dark:bg-indigo-600 dark:hover:bg-indigo-500";
}
function getPriorityClasses(priority) {
  if (priority === "high") {
    return "bg-red-300 hover:bg-red-400 dark:bg-red-600 dark:hover:bg-red-500";
  }
  if (priority === "medium") {
    return "bg-yellow-300 hover:bg-yellow-400 dark:bg-yellow-600 dark:hover:bg-yellow-500";
  }
  return "bg-green-300 hover:bg-green-400 dark:bg-green-600 dark:hover:bg-green-500";
}
Qué se ha hecho:

createTaskElement ahora solo orquesta: crea el contenedor y le asigna el HTML.
createTaskContainer se encarga solo de crear y configurar el <div> (clases y dataset).
buildTaskInnerHTML construye solo el markup interno de la tarjeta.
getCategoryClasses y getPriorityClasses encapsulan la lógica de selección de clases según categoría/prioridad.

````

**Por qué funciona:**  
Fomenta la modularidad y mantenibilidad del código.

---

## 7. Explicación para novato
**Prompt:**
> Explica esta función de forma sencilla, como si fueras un profesor explicando a un estudiante que conoce HTML y JS básico.

```js
function attachTaskListeners(task, div) {
  const deleteBtn = div.querySelector(".delete-btn");

  // Click en toda la tarjeta para marcar completada
  div.addEventListener("click", (e) => {
    if (e.target === deleteBtn) return;

    task.completed = !task.completed;
    div.classList.toggle("opacity-50");
    div.classList.toggle("completed");

    if (task.completed) {
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

    saveTasks();
    updateCounters(tasks);
  });
  ```

  Qué hace, paso a paso
function attachTaskListeners(task, div) { ... }
Es una función que recibe:

task: el objeto con los datos de la tarea (por ejemplo { text, completed }).
div: el elemento HTML que representa la tarjeta de esa tarea.
const deleteBtn = div.querySelector(".delete-btn");
Dentro de la tarjeta (div), busca el botón que tiene la clase .delete-btn (el botón de borrar) y lo guarda en deleteBtn.

div.addEventListener("click", (e) => { ... })
Añade un listener de clic a toda la tarjeta:

Cualquier clic dentro del div ejecutará esta función, excepto si luego se hace un return.
if (e.target === deleteBtn) return;

e.target es el elemento exacto donde se hizo clic.
Si el usuario ha hecho clic en el botón de borrar (deleteBtn), no queremos marcar la tarea como completada, solo borrar, así que salimos de la función con return.
task.completed = !task.completed;

Cambia el estado de la tarea:
Si antes estaba false (pendiente), pasa a true (completada).
Si estaba true, pasa de nuevo a false.
div.classList.toggle("opacity-50"); y div.classList.toggle("completed");

Alterna estas clases CSS en la tarjeta:
opacity-50: baja la opacidad (se ve más tenue).
completed: marca visualmente/semánticamente que está completada (por si el CSS usa esa clase).
if (task.completed) { ... } else { ... }

Si la tarea ha quedado como completada:
div.classList.add("bg-green-100", "dark:bg-green-700", "line-through", "text-gray-500");
Fondo verde claro.
En modo oscuro, fondo verde más oscuro.
Texto tachado (line-through).
Color de texto gris.
Si la tarea ha quedado como no completada:
div.classList.remove(...) con las mismas clases:
Quita el fondo verde, el tachado y el texto gris, volviendo al aspecto normal.
saveTasks();
Llama a una función que guarda el array de tareas en localStorage, para que el cambio (completado/no completado) se conserve al recargar la página.

updateCounters(tasks);
Llama a una función que recalcula y actualiza los contadores de:

Tareas pendientes.
Tareas completadas.
Total de tareas.
En resumen: esta función conecta la tarjeta de la tarea con su comportamiento: cuando haces clic en la tarjeta (pero no en el botón de borrar), la tarea se marca o desmarca como completada, se actualiza el estilo visual, se guardan los cambios y se refrescan los contadores.

**Por qué funciona:**  
Convierte código complejo en explicación accesible, útil para documentación o aprendizaje.

---

## 8. Reescritura para seguridad
**Prompt:**
> Reescribe esta función evitando inyecciones de HTML/JS y usando solo métodos seguros del DOM.

```js
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
    <p class="flex-1 font-medium text-gray-800 dark:text-gray-100 title">
      ${task.text}
    </p>

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

    <button class="delete-btn text-sm hover:scale-110 transition-transform duration-200 ml-2">
      ❌
    </button>
  `;

  return div;
}
```

Función revidasa:

```js
function createTaskElement(task) {
  const taskEl = document.createElement("div");

  taskEl.classList.add(
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

  taskEl.dataset.category = task.category;
  taskEl.dataset.id = String(task.id);

  // Texto de la tarea
  const titleEl = document.createElement("p");
  titleEl.classList.add(
    "flex-1",
    "font-medium",
    "text-gray-800",
    "dark:text-gray-100",
    "title",
  );
  titleEl.textContent = task.text;

  // Badge de categoría
  const categoryEl = document.createElement("span");
  categoryEl.classList.add(
    "px-2",
    "py-1",
    "text-xs",
    "rounded-full",
    "text-white",
    "transition-colors",
    "duration-200",
  );

  const categoryClasses =
    task.category === "trabajo"
      ? ["bg-purple-400", "hover:bg-purple-500", "dark:bg-purple-600", "dark:hover:bg-purple-500"]
      : task.category === "hogar"
      ? ["bg-pink-300", "hover:bg-pink-400", "dark:bg-pink-600", "dark:hover:bg-pink-500"]
      : ["bg-indigo-300", "hover:bg-indigo-400", "dark:bg-indigo-600", "dark:hover:bg-indigo-500"];

  categoryEl.classList.add(...categoryClasses);
  categoryEl.textContent = capitalize(task.category);

  // Badge de prioridad
  const priorityEl = document.createElement("span");
  priorityEl.classList.add(
    "px-2",
    "py-1",
    "text-xs",
    "rounded-full",
    "text-white",
    "transition-colors",
    "duration-200",
  );

  const priorityClasses =
    task.priority === "high"
      ? ["bg-red-300", "hover:bg-red-400", "dark:bg-red-600", "dark:hover:bg-red-500"]
      : task.priority === "medium"
      ? ["bg-yellow-300", "hover:bg-yellow-400", "dark:bg-yellow-600", "dark:hover:bg-yellow-500"]
      : ["bg-green-300", "hover:bg-green-400", "dark:bg-green-600", "dark:hover:bg-green-500"];

  priorityEl.classList.add(...priorityClasses);
  priorityEl.textContent = priorityText(task.priority);

  // Botón de borrado
  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.classList.add(
    "delete-btn",
    "text-sm",
    "hover:scale-110",
    "transition-transform",
    "duration-200",
    "ml-2",
  );
  deleteBtn.textContent = "❌";

  taskEl.appendChild(titleEl);
  taskEl.appendChild(categoryEl);
  taskEl.appendChild(priorityEl);
  taskEl.appendChild(deleteBtn);

  return taskEl;
}
```

**Por qué funciona:**  
Asegura que la IA considere aspectos de seguridad al generar código.

---

## 9. Generación de documentación
**Prompt:**
> Genera comentarios JSDoc para todas las funciones del archivo app.js, indicando parámetros, retorno y descripción.

/**
 * Actualiza el icono del botón de tema (🌙/☀️)
 * en función de si el documento está en modo oscuro.
 *
 * @returns {void}
 */
function updateThemeIcon() {
  // ...
}

/**
 * Crea el elemento DOM que representa una tarea.
 *
 * @param {{ id: number|string, text: string, category: string, priority: string, completed: boolean }} task
 *  Objeto tarea con su identificador, texto, categoría, prioridad y estado de completado.
 * @returns {HTMLDivElement} Elemento <div> con toda la estructura visual de la tarea.
 */
function createTaskElement(task) {
  // ...
}

/**
 * Añade los listeners de interacción a una tarjeta de tarea:
 * marcar/desmarcar como completada y eliminación de la tarea.
 *
 * @param {{ id: number|string, text: string, category: string, priority: string, completed: boolean }} task
 *  Objeto tarea asociado a la tarjeta.
 * @param {HTMLDivElement} div Elemento DOM que representa la tarjeta de tarea.
 * @returns {HTMLDivElement} El mismo elemento de tarea, con los listeners ya conectados.
 */
function attachTaskListeners(task, div) {
  // ...
}

/**
 * Renderiza una tarea en la lista:
 * crea su elemento DOM, le añade listeners y lo inserta en el contenedor de tareas.
 *
 * @param {{ id: number|string, text: string, category: string, priority: string, completed: boolean }} task
 *  Objeto tarea que se va a pintar en la interfaz.
 * @returns {void}
 */
function renderTask(task) {
  // ...
}

/**
 * Guarda el array global de tareas en localStorage
 * serializado como JSON bajo la clave "tasks".
 *
 * @returns {void}
 */
function saveTasks() {
  // ...
}

/**
 * Capitaliza un texto: pone en mayúscula la primera letra
 * y deja el resto tal cual.
 *
 * @param {string} text Texto a capitalizar.
 * @returns {string} Texto capitalizado o cadena vacía si no se proporciona texto.
 */
function capitalize(text) {
  // ...
}

/**
 * Devuelve la etiqueta legible en español para una prioridad interna.
 *
 * @param {"high"|"medium"|"low"} priority Prioridad interna de la tarea.
 * @returns {string} Texto de prioridad legible: "Alta", "Media" o "Baja".
 */
function priorityText(priority) {
  // ...
}

/**
 * Actualiza los contadores de tareas en la interfaz
 * (pendientes, completadas y totales), en función del array de tareas recibido.
 *
 * @param {Array<{ completed: boolean }>} tasks
 *  Lista de tareas sobre la que se calculan los contadores.
 * @returns {void}
 */
function updateCounters(tasks) {
  // ...
}

**Por qué funciona:**  
Automatiza documentación estándar, ahorrando tiempo en proyectos grandes.

## 10. Optimización de rendimiento
**Prompt:**
> Revisa esta función y sugiere optimizaciones para rendimiento, incluyendo menor manipulación del DOM y operaciones de array más eficientes.

```js
function attachTaskListeners(task, div) {
  const deleteBtn = div.querySelector(".delete-btn");

  // Click en toda la tarjeta para marcar completada
  div.addEventListener("click", (e) => {
    if (e.target === deleteBtn) return;

    task.completed = !task.completed;
    div.classList.toggle("opacity-50");
    div.classList.toggle("completed");

    if (task.completed) {
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

    saveTasks();
    updateCounters(tasks);
  });

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
```

Sugerencias de optimización
Reducir operaciones sobre classList

En vez de añadir y quitar muchas clases cada vez, usa una sola clase de estado (por ejemplo task-completed) y deja que el CSS haga el resto.
Entonces solo haces div.classList.toggle("task-completed"); en JS.
if (task.completed) {
  div.classList.add("task-completed");
} else {
  div.classList.remove("task-completed");
}
Y en CSS:

.task-completed {
  opacity: 0.5;
  background-color: rgb(220 252 231); /* equivalente a bg-green-100 */
}
Esto reduce varias llamadas a classList.add/remove por click.

Evitar tasks = tasks.filter(...) en cada borrado

filter recorre todo el array en cada eliminación.
Para listas grandes, es más barato buscar el índice y hacer splice una vez, o mantener un Map por id.
Versión simple con findIndex:
const index = tasks.findIndex((t) => t.id === task.id);
if (index !== -1) {
  tasks.splice(index, 1);
}
Centralizar guardado y actualización de contadores

La función llama muchas veces a saveTasks() y updateCounters(tasks) (una por click de completar y otra por borrado).
Extrae a una función pequeña para evitar duplicación y dejar claro el coste:
function persistAndUpdate() {
  saveTasks();
  updateCounters(tasks);
}
Y usarla en ambos sitios:

persistAndUpdate();
(Más avanzado) Usar delegación de eventos en vez de un listener por tarjeta

En lugar de añadir listeners click a cada div y deleteBtn, puedes:
Poner un solo click en el contenedor taskList.
Detectar si el target es .delete-btn o una tarjeta .task.
Esto reduce mucho el número de listeners cuando hay muchas tareas.
Esquema:

taskList.addEventListener("click", (e) => {
  const deleteBtn = e.target.closest(".delete-btn");
  const taskEl = e.target.closest(".task");
  if (!taskEl) return;
  // buscar task por id en dataset
  const id = Number(taskEl.dataset.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  if (deleteBtn) {
    // lógica de borrado
  } else {
    // toggle completada
  }
});
Así, attachTaskListeners ni siquiera sería necesario, o se simplificaría mucho.

Micro-mejora: evitar recrear funciones anónimas por tarea (si escalara mucho)

En un caso extremo con miles de tareas, tener una función por tarjeta puede tener impacto.
La delegación de eventos del punto 4 ya soluciona esto: hay solo un listener.
Versión optimizada manteniendo estructura actual (sin delegación)
function persistAndUpdate() {
  saveTasks();
  updateCounters(tasks);
}
function attachTaskListeners(task, div) {
  const deleteBtn = div.querySelector(".delete-btn");
  div.addEventListener("click", (e) => {
    if (e.target === deleteBtn) return;
    task.completed = !task.completed;
    div.classList.toggle("opacity-50");
    div.classList.toggle("completed");
    div.classList.toggle("task-completed"); // una sola clase de estado
    persistAndUpdate();
  });
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const index = tasks.findIndex((t) => t.id === task.id);
    if (index !== -1) {
      tasks.splice(index, 1);
    }
    div.remove();
    persistAndUpdate();
  });
  return div;
}
Con esto reduces:

Número de operaciones sobre clases.
Coste de borrar (filter → findIndex + splice).
Duplicación de llamadas a saveTasks y updateCounters.

**Por qué funciona:**  
Se enfoca en eficiencia, lo que es útil en proyectos con listas grandes o cálculos intensivos.

