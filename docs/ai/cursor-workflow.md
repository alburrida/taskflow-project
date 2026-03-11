# Flujo de trabajo con Cursor

## Propósito del documento

Este documento describe cómo se integró el IDE Cursor, asistido por inteligencia artificial, dentro del flujo de desarrollo del proyecto TaskFlow.

Se documentará:

- Cómo se configuró Cursor
- Cómo se utilizó la asistencia de IA dentro del IDE
- Ejemplos de prompts utilizados
- Cómo ayudó en tareas de programación, refactorización o depuración
- Limitaciones o problemas encontrados durante su uso

## Instalación y apertura del proyecto

Se instaló Cursor desde su página oficial y se utilizó para abrir el proyecto **TaskFlow**.

Una vez abierto el proyecto, se exploraron los principales elementos de la interfaz:

- **Explorador de archivos**: permite navegar por la estructura del proyecto y abrir archivos fácilmente.
- **Editor de código**: zona central donde se escribe y modifica el código.
- **Terminal integrada**: permite ejecutar comandos como `git`, `npm` o scripts del proyecto sin salir del editor.
- **Chat con IA**: permite hacer preguntas sobre el código o pedir mejoras directamente dentro del editor.

---

## Prueba de autocompletado con comentarios

Se probó el autocompletado de Cursor escribiendo comentarios que describían una función.  

Ejemplo:

// función que devuelve el número de tareas completadas
function completedTasks() {
  return tasks.filter(t => t.completed).length;
} 

// función que devuelve el número de tareas pendientes
function pendingTasks() {
  return tasks.filter(t => !t.completed).length;
} 

// función que devuelve el número de tareas
function totalTasks() {
  return tasks.length;
} 

## Uso del chat contextual

Se utilizó el chat contextual de Cursor para analizar partes del código del proyecto.

Para ello se seleccionó una función y se abrió el chat con el atajo **Ctrl + L**. Después se pidió una explicación del código seleccionado.

Ejemplo de prompt utilizado:

> Esta función se puede obviar?

Cursor analizó el código y proporcionó una explicación del funcionamiento de la función y su importancia dentro del archivo.

Esta herramienta resulta útil para comprender rápidamente código existente, especialmente en proyectos grandes o cuando se trabaja con código escrito previamente.

## Edición inline con IA

Cursor permite modificar funciones directamente desde el editor utilizando instrucciones en lenguaje natural.

Para probar esta función se seleccionó una función del proyecto y se utilizó el atajo **Ctrl + K**, que abre la herramienta de edición con IA.

Ejemplo de instrucción utilizada:

>Añade comentarios que expliquen qué hace cada apartado y mejora la legibilidad

Cursor generó automáticamente una versión mejor estructurada del código, mejorando la legibilidad y manteniendo la misma funcionalidad.

## Uso de Composer

También se probó la herramienta **Composer** de Cursor, que permite generar cambios que afectan a varios archivos del proyecto.

Se abrió Composer y se pidió una mejora general del código con una instrucción en lenguaje natural.

Ejemplo de prompt utilizado:

> Mejora la legibilidad del código del proyecto.

Cursor analizó la estructura del proyecto y propuso cambios en varios archivos, mostrando exactamente qué líneas se iban a modificar.

Esta herramienta resulta útil para realizar refactorizaciones globales o aplicar mejoras en múltiples partes del proyecto sin tener que modificar cada archivo manualmente.

## Atajos de teclado más utilizados

Durante el uso de Cursor en el proyecto TaskFlow se utilizaron principalmente los siguientes atajos de teclado:

- **Ctrl + L** → Abrir el chat contextual para analizar o explicar código seleccionado.
- **Ctrl + K** → Editar código inline utilizando instrucciones en lenguaje natural.
- **Ctrl + Shift + Y** → Guardar o aplicar los cambios generados por Composer.

Estos atajos permiten trabajar de forma más rápida con las herramientas de IA integradas en el editor.

---

## Ejemplos de mejoras realizadas por Cursor

### 1. Mejora de la legibilidad del código en el archivo app.js

Cursor se utilizó para refactorizar algunas funciones del proyecto con el objetivo de mejorar la legibilidad.  
Tras seleccionar una función y utilizar **Ctrl + K**, se pidió a Cursor que mejorara la estructura del código.

El resultado fue:

- mejor indentación
- uso de nombres de variables más claros
- mejor organización de las líneas de código

Esto facilitó la comprensión de las funciones.

---

### 2. Añadir comentarios explicativos

También se utilizó Cursor para añadir comentarios explicativos al código existente.

Mediante instrucciones en lenguaje natural, Cursor añadió comentarios que describían qué hacía cada función y cuál era su propósito dentro del archivo.

Esto ayudó a mejorar la documentación interna del código y hace que el proyecto sea más fácil de entender para otros desarrolladores.