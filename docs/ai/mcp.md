# Model Context Protocol (MCP)

## Qué es MCP

El **Model Context Protocol (MCP)** es un protocolo que permite conectar modelos de inteligencia artificial con herramientas externas y fuentes de datos.  
Gracias a MCP, un asistente de IA puede acceder directamente a información del entorno de desarrollo, como archivos del proyecto, repositorios o sistemas externos.

Esto permite que la IA tenga **más contexto real del proyecto**, en lugar de depender únicamente del texto que el usuario le proporcione.

En el caso de **Cursor**, MCP permite conectar servidores que dan acceso a recursos como:

- Sistema de archivos del proyecto  
- Repositorios de GitHub  
- Bases de datos  
- APIs externas  

De esta forma, la IA puede analizar el proyecto de forma más precisa y responder preguntas sobre el código existente.

---

# Instalación y configuración de MCP en Cursor

### 1. Abrir la configuración de MCP

Dentro de Cursor se accede a la configuración de MCP desde:

`Settings → MCP`

Ahí se puede configurar qué servidores MCP estarán disponibles para la IA.

### 2. Crear el archivo de configuración

Cursor utiliza un archivo de configuración llamado:

`.cursor/mcp.json`

En este archivo se definen los servidores MCP que se van a utilizar.

La estructura básica es:

```json
{
  "mcpServers": {}
}

Este servidor permite que la IA pueda:

- Leer archivos del proyecto.

- Analizar el contenido del código.

- Mostrar la estructura de carpetas.

- Explicar funciones existentes.

## Consultas realizadas utilizando MCP

Para comprobar el funcionamiento del servidor MCP se realizaron varias consultas al asistente.

### Consulta 1 — Estructura del proyecto

Se pidió a la IA mostrar la estructura de archivos del proyecto.

La IA identificó correctamente los archivos principales:

index.html

app.js

style.css

README.md

cursor/mcp.json

Y también los documentos dentro de:

docs/ai

## Consultas MCP (resumen)

Se configuró un servidor MCP para permitir que la IA accediera a los archivos de TaskFlow.  
Se realizaron cinco consultas principales:

1. **Estructura del proyecto**  
   Archivos principales: `index.html`, `app.js`, `style.css`, `README.md`, `cursor/mcp.json`  
   Carpeta `docs/ai` con documentación: `ai-comparison.md`, `prompt-engineering.md`, `experiments.md`, `cursor-workflow.md`, `reflection.md`, `mcp.md`

2. **Explicación del README**  
   TaskFlow permite: crear tareas con categoría y prioridad, marcar completadas, eliminar, filtrar, buscar y guardar datos en `localStorage`. Incluye modo oscuro y diseño responsive con Tailwind CSS.

3. **Análisis de app.js**  
   Gestiona ciclo completo de tareas: creación, renderizado, completar, eliminar, filtrar, buscar, persistencia y contadores reactivos. También maneja modo oscuro.

4. **Funciones de contador**  
   `updateCounters(tasks)` calcula pendientes, completadas y totales y actualiza los elementos DOM: `#counter-pending`, `#counter-completed`, `#counter-total`.

5. **Renderizado de tareas**  
   `renderTask(task)` crea la tarjeta HTML, añade eventos de completar/eliminar y mantiene sincronizado el estado con el DOM y `localStorage`.

---

## Casos de uso reales de MCP

- Análisis automático de proyectos grandes  
- Documentación automática y actualizada  
- Refactorización asistida  
- Debugging más preciso  
- Integración con repositorios y revisión de Pull Requests

**Conclusión:** MCP permite a la IA acceder directamente a archivos del proyecto, facilitando análisis, documentación, refactorización y mejora del flujo de desarrollo.