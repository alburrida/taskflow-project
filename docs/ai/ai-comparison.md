# Comparación de herramientas de IA

## Propósito del documento

Este documento tiene como objetivo comparar diferentes asistentes de inteligencia artificial utilizados durante el desarrollo del proyecto TaskFlow.

Se analizará el uso de herramientas como ChatGPT y Claude para tareas como:

- Generación de código
- Depuración de errores
- Toma de decisiones arquitectónicas
- Creación de documentación
- Mejora de la productividad

# Comparación de asistentes de IA: ChatGPT y Claude

---

## 1️ Event Loop

**Prompt:**

> Hola, ¿podrías explicarme qué es un event loop en JavaScript?

**Análisis:**

- **Claude:** Explicación conceptual y técnica sobre call stack, event queue y ejecución de callbacks. Correcta pero más formal y sin ejemplos prácticos.
- **ChatGPT:** Explicación pedagógica con ejemplos de código, analogías y microtasks (Promises). Más fácil de entender para principiantes.

**Conclusión:**  
Ambos correctos, pero **ChatGPT más claro y práctico** para aprendizaje.

---

## 2️ DOM (Document Object Model)

**Prompt:**

> ¿Qué es DOM?

**Análisis:**

- **Claude:** Definición técnica del DOM como API estándar que representa el documento HTML/XML y permite manipulación de estructura y contenido. Bien organizado pero sin ejemplos.
- **ChatGPT:** Explicación visual con árbol del DOM y ejemplos de código para seleccionar elementos, modificar texto y escuchar eventos.

**Conclusión:**  
Claude es correcto y formal, **ChatGPT más didáctico y fácil de comprender**.

---

## 3️ Closures

**Prompt:**

> ¿Podrías darme ejemplos de closures?

**Análisis:**

- **Claude:** Presenta 3 ejemplos clásicos de closures: función interna con variable externa, contador y generador de funciones.
- **ChatGPT:** Ofrece más ejemplos prácticos: contador, encapsulación de datos privados, closures con `setTimeout`, funciones generadoras y event listeners.

**Conclusión:**  
Ambos correctos, pero **ChatGPT ofrece más ejemplos y explicaciones**, lo que ayuda a comprender mejor el uso real de closures.


## Comparación de respuestas de IA por concepto

| Concepto       | Criterio                 | Claude       | ChatGPT    |
|----------------|--------------------------|-------------|-------------|
| Event Loop     | Claridad                 | Buena       | Muy alta    |
|                | Profundidad conceptual   | Media       | Media-alta  |
|                | Ejemplos de código       | No          | Sí          |
|                | Facilidad                | Media       | Alta        |
| DOM            | Claridad                 | Buena       | Muy alta    |
|                | Profundidad conceptual   | Alta        | Alta        |
|                | Ejemplos de código       | No          | Sí          |
|                | Facilidad                | Media       | Alta        |
| Closures       | Claridad                 | Alta        | Muy alta    |
|                | Profundidad conceptual   | Media       | Alta        |
|                | Número de ejemplos       | 3           | 5           |
|                | Casos de uso prácticos   | Media       | Alta        |
|                | Facilidad                | Media       | Alta        |

---

## Conclusión general

## Comparación general de asistentes

| Criterio                   | Claude     | ChatGPT    |
|----------------------------|------------|------------|
| Claridad                   | Alta       | Muy alta   |
| Explicación conceptual     | Media      | Alta       |
| Número de ejemplos         | 3          | 5          |
| Casos de uso prácticos     | Media      | Alta       |
| Facilidad                  | Media      | Alta       |

Ambos asistentes proporcionan explicaciones **técnicamente correctas**.  
- **Claude:** más conciso y conceptual.  
- **ChatGPT:** más pedagógico, con ejemplos prácticos, visualizaciones y explicaciones paso a paso.  

Para aprendizaje y documentación práctica, **ChatGPT se muestra más completo y accesible**.

## Detección de errores en funciones JavaScript

Se evaluaron tres funciones con errores de sintaxis y lógica: `updateCounter`, `capitalize` y `priorityText`. Se analizó cómo los asistentes identifican y corrigen los problemas.

### Prompt

> ¿Por qué no funcionan estas 3 funciones?
>
> ```javascript
> function updateCounter() { if return; const pending = tasks.filter(t => !t.completed).length; counter.textContent = Tareas pendientes: ${pending}; }
> function capitalize) { if (!text) return ""; return text.charAt(0).toUpperCase() + text.slice(1); }
> function priorityText(priority) { if (priority === ) return "Alta"; if (priority === "medium") return "Media"; return "Baja"; }
> ```

---

### Análisis por función

**1️ updateCounter**

- **Claude:**  
  - Detecta `if return;` sin condición.  
  - Propone corregirlo a `if (!counter) return;`.

- **ChatGPT:**  
  - Detecta `if return;` sin condición.  
  - Recomienda `if (!tasks) return;`.  
  - Explica posibles errores de referencia (`ReferenceError`) si las variables no existen.

**2️ capitalize**

- **Claude:**  
  - Falta el parámetro en la definición.  
  - Corrige a `function capitalize(text)`.

- **ChatGPT:**  
  - Igual, falta parámetro.  
  - Corrige a `function capitalize(text)`.

**3️ priorityText**

- **Claude:**  
  - Comparación incompleta: `if (priority === )`.  
  - Sugiere agregar `"high"`.

- **ChatGPT:**  
  - Igual, falta `"high"` en la comparación.  
  - Explica por qué es necesario según el contexto de `"medium"` en la siguiente línea.

---

### Código corregido propuesto

```javascript
function updateCounter() {
  if (!counter) return;
  const pending = tasks.filter(t => !t.completed).length;
  counter.textContent = `Tareas pendientes: ${pending}`;
}

function capitalize(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function priorityText(priority) {
  if (priority === "high") return "Alta";
  if (priority === "medium") return "Media";
  return "Baja";
}