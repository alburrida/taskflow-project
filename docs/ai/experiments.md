# Experimentos con inteligencia artificial

## Propósito del documento

Este documento registrará diferentes experimentos realizados utilizando herramientas de inteligencia artificial durante el desarrollo del proyecto TaskFlow.

Algunos ejemplos de experimentos incluyen:

- Generación de código con IA
- Refactorización de código existente
- Uso de IA para depuración
- Conexión con herramientas externas como servidores MCP
- Pruebas de flujos de trabajo asistidos por IA en Cursor

## Elegir tres pequeños problemas de programación

### Invertir un string

- Input: "TaskFlow"

- Output esperado: "wolFksaT"

### Contar palabras en un texto

- Input: "Esta es una prueba"

- Output esperado: 4

### Filtrar números pares de un array

- Input: [1,2,3,4,5,6]

- Output esperado: [2,4,6]

### 1️ Invertir un string

```js
const cadenaOriginal = "Hola Mundo";
const cadenaInvertida = cadenaOriginal.split('').reverse().join('');
console.log(cadenaInvertida); // "odnuM aloH"


```
### Ejemplo de la IA 
```js
function reverseString(str) {
  return str.split("").reverse().join("");
}

reverseString("TaskFlow"); // "wolFksaT"
```

### 2 Contar palabras en un texto

```js
function contarPalabras(texto) {
  return texto.trim().split(/\s+/).filter(palabra => palabra.length > 0).length;
}
// Ejemplo de uso:
const texto = "  Hola, mundo!   Este es un texto   de ejemplo.  ";
console.log(contarPalabras(texto)); // Resultado: 8

```

### Ejemplo de la IA

```js
function countWords(text) {
  return text
    .trim()
    .split(/\s+/)  // uno o más espacios
    .filter(Boolean).length;
}

countWords("Esta es una prueba"); // 4
```

### 3 Filtrar números pares en un array

```js
const listaNumeros = [12, 5, 8, 130, 44, 23];
const soloPares = listaNumeros.filter(n => n % 2 === 0);

console.log(soloPares); // Salida: [12, 8, 44]

```

### Ejemplo de la IA

```js
function getEvenNumbers(numbers) {
  return numbers.filter((n) => n % 2 === 0);
}

getEvenNumbers([1, 2, 3, 4, 5, 6]); // [2, 4, 6]
```

**Conclusión:**La Ia tarda mucho menos tiempo, tiene encuenta lo óptimo que puede ser el código antes de generarlo y tiene una forma de escritura más simple y clara.

##  Tres tareas relacionadas con mi proyecto

### Mejorar el contador de tareas pendientes, completadas y totales.

```js
/* ===== CONTADOR REFACTORIZADO ===== */

/**
 * Actualiza los contadores de tareas en la interfaz.
 * Muestra tareas pendientes, completadas y totales.
 * @param {Array} tasks - Array de tareas, cada una con propiedad `completed`
 */
function updateCounters(tasks) {
  // Seleccionamos los elementos del DOM donde se mostrarán los contadores
  const pendingEl = document.getElementById("counter-pending");
  const completedEl = document.getElementById("counter-completed");
  const totalEl = document.getElementById("counter-total");

  if (!pendingEl || !completedEl || !totalEl) return;

  // Calculamos los valores
  const pending = tasks.filter(t => !t.completed).length;
  const completed = tasks.filter(t => t.completed).length;
  const total = tasks.length;

  // Actualizamos el DOM
  pendingEl.textContent = `Pendientes: ${pending}`;
  completedEl.textContent = `Completadas: ${completed}`;
  totalEl.textContent = `Total: ${total}`;
}
```

### Mejora propuesta por la IA

```js
// Cacheamos elementos del DOM fuera de la función para no buscarlos en cada llamada
const pendingCounterEl = document.getElementById("counter-pending");
const completedCounterEl = document.getElementById("counter-completed");
const totalCounterEl = document.getElementById("counter-total");

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
```
Qué mejora:
Menos trabajo de DOM: se cachean los elementos de los contadores en constantes globales (no se hace getElementById en cada llamada).
Menos pasadas al array: se recorre tasks una sola vez (antes eran dos filter).
Tipos más claros: JSDoc indica que tasks es un array de objetos con completed.

### Revisa app.js y arregla la función renderTask para que las tareas se guarden como completadas cuando recargues la página

### Mejora propuesta por IA

```js
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

/* ===== AÑADIR LISTENERS A LA TAREA ===== */
function attachTaskListeners(task, div) {
  const deleteBtn = div.querySelector(".delete-btn");

  // Click en toda la tarjeta para marcar completada
  div.addEventListener("click"), (e) => {
    if (e.target === deleteBtn) return;

    task.completed = !task.completed;
    updateTaskVisualState(task, div);

     // Aplicar estado visual inicial según si la tarea está completada
  updateTaskVisualState(task, div);

  return div;
  }
}
```
IA: He ajustado la lógica para que las tareas completadas conserven su aspecto al recargar:

- Nuevo helper updateTaskVisualState(task, div): centraliza todas las clases visuales de “tarea completada” (opacity-50, completed, fondo verde, tachado, etc.).

- En attachTaskListeners: al hacer clic se cambia task.completed y se llama a updateTaskVisualState, manteniendo el guardado en localStorage y los contadores como antes.

- En createTaskElement: tras construir el div, se llama a updateTaskVisualState(task, div), de modo que al cargar desde localStorage las tareas que ya estaban completadas se pintan directamente como completadas.

### Revisa la función renderTask y refactorizala para que sea más legible

```js
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

```

IA: He hecho renderTask más legible:

-Añadido JSDoc describiendo claramente qué hace y qué tipo de objeto espera.

-Renombrado variables (div → taskElement) para que el propósito sea evidente.

-Añadida pequeña validación (if (!taskList || !task) return;) para evitar errores si el contenedor o la tarea no existen.

-Mantiene la responsabilidad simple y clara: crear el elemento, añadir listeners e insertarlo en taskList.
