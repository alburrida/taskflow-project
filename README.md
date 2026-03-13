# TaskFlow

Aplicación web para gestionar tareas de manera local, con interfaz moderna, modo oscuro y un sistema de diseño profesional basado en **Tailwind CSS**.

---

# Funcionalidades

- Añadir nuevas tareas con **categoría** y **prioridad**.
- **Editar tareas existentes** mediante un botón de edición.
- Marcar tareas como **completadas** haciendo click en la tarjeta.
- Borrar tareas individualmente.
- Filtrar tareas por categoría con botones estilo **chips**.
- Buscar tareas por texto en tiempo real.
- **Contadores de tareas** (pendientes, completadas y totales).
- Persistencia en **LocalStorage**: las tareas permanecen al recargar la página.
- **Modo oscuro** activable mediante un botón en el header.
- Interfaz **responsive** y accesible.

---

# Cómo usarlo

1. Escribe la tarea en el formulario.
2. Selecciona **categoría** y **prioridad**.
3. Pulsa **Añadir** para crear la tarea.
4. Haz click en una tarea para marcarla como **completada**.
5. Pulsa el botón **✏️** para **editar una tarea existente**.
6. Pulsa el botón **❌** para **eliminar** una tarea.
7. Usa el buscador para **filtrar tareas por texto**.
8. Filtra tareas por categoría usando los **chips de categoría**.
9. Pulsa el botón **🌙 / ☀️** para cambiar entre **modo claro y oscuro**.

---

# Tecnologías

- **HTML5**
- **JavaScript**
  - Manipulación del DOM
  - LocalStorage
- **Tailwind CSS** para estilos, layout y modo oscuro

---

# Interfaz

La interfaz está organizada en secciones claras para facilitar el uso:

### Panel izquierdo
Contiene las herramientas de **organización y búsqueda**:

- Barra de **búsqueda de tareas**
- Filtros por **categoría**

### Panel derecho
Contiene las herramientas de **gestión de tareas**:

- Formulario para **añadir nuevas tareas**
- Selector de **categoría**
- Selector de **prioridad**
- Lista de **tareas creadas**

### Contador de tareas
En la parte superior se muestran tres contadores:

- **Pendientes**
- **Completadas**
- **Total de tareas**

Estos contadores se actualizan automáticamente cada vez que se:

- añade una tarea
- completa una tarea
- elimina una tarea

---

# Validaciones del formulario

Se han añadido validaciones para mejorar la experiencia de usuario:

- La tarea debe tener **entre 3 y 100 caracteres**
- Si no cumple los requisitos, se muestra **un mensaje de error dentro de la interfaz**
- Se evita el uso de **alertas del navegador**, manteniendo la experiencia visual dentro de la aplicación

---

# Estilos y diseño

- Colores pastel para **categorías y prioridades**
- Tarjetas de tareas con **sombra y hover animado**
- Hover mejorado para **modo oscuro**
- Interfaz inspirada en **Notion**: limpia, clara y moderna
- Transiciones suaves en botones, inputs y chips
- `select-none` aplicado para evitar **selección accidental del contenido**
- Diseño **responsive**, adaptado a móvil y escritorio

---

# Mejoras recientes

Durante el desarrollo se han realizado varias mejoras con ayuda de **IA (Cursor y ChatGPT)**:

- Implementación de **botón de edición de tareas**
- Sistema de **contadores dinámicos**
- **Validaciones del formulario** con mensajes visuales
- Refactorización de funciones para mejorar la **legibilidad**
- Uso de **JSDoc** para documentar funciones
- Mejoras de **UX en modo oscuro**

Las herramientas de IA se utilizaron principalmente para:

- refactorizar funciones
- mejorar la organización del código
- generar documentación técnica
- proponer mejoras de interfaz

Todos los cambios generados por IA fueron **revisados manualmente antes de ser aceptados**.

---

# Despliegue

La aplicación se puede desplegar fácilmente en **Vercel**.

# Mejoras pendientes

Mejoras que se esperan añadir en un futuro:

- Mejora de la interfaz
- Elecciónn entre varios temas disponibles
- Descripción para cada tarea
- Compatibilidad para exportar tareas a google calendar