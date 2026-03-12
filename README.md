# TaskFlow

Aplicación web para gestionar tareas de manera local, con interfaz moderna, modo oscuro y un sistema de diseño profesional basado en Tailwind CSS.

---

## Funcionalidades

- Añadir nuevas tareas con **categoría** y **prioridad**.
- Marcar tareas como **completadas** haciendo click en la tarjeta.
- Borrar tareas individualmente.
- Filtrar tareas por categoría con botones estilo “chips”.
- Buscar tareas por texto en tiempo real.
- Persistencia en **LocalStorage**: las tareas permanecen al recargar la página.
- **Modo oscuro** activable mediante un botón en el header.
- Interfaz **responsive** y accesible.

---

## Cómo usarlo

1. Escribe la tarea en el formulario y selecciona la categoría y prioridad.
2. Pulsa **Añadir** para crear la tarea.
3. Click en una tarea para marcarla como **completada**.
4. Click en el botón ❌ para **eliminar** una tarea.
5. Usa el buscador para filtrar tareas por texto.
6. Pulsa el botón 🌙/☀️ en el header para alternar entre **modo claro y oscuro**.
7. Filtra tareas por categoría haciendo click en los **botones de categoría**.

---

## Tecnologías

- HTML5
- JavaScript (DOM, LocalStorage)
- Tailwind CSS para diseño y modo oscuro

---

## Estilos y diseño

- Colores pastel para las categorías y prioridades.
- Tarjetas de tareas con sombra y hover animado.
- Interfaz inspirada en **Notion**: limpia, clara y moderna.
- Transiciones suaves en botones, inputs y chips de tarea.
- Responsive: adaptada a móvil y escritorio.

---

## Despliegue

- La aplicación se puede desplegar fácilmente en **Vercel**.

## Mejoras recientes

Gracias al uso de técnicas de **refactorización y asistencia con IA** (Cursor y ChatGPT), se han incorporado las siguientes mejoras en TaskFlow:

- **Contadores de tareas**:  
  - Pendientes, completadas y totales, actualizados automáticamente al crear, completar o eliminar tareas.  
  - Visualización integrada en la interfaz con colores diferenciados.

- **Validaciones mejoradas en el formulario**:  
  - Tareas deben tener **entre 3 y 15 caracteres**.  
  - Los mensajes de error se muestran directamente en la interfaz, no como alertas del navegador.

- **Interfaz más clara y accesible**:  
  - Hover en tarjetas de tareas visible en **modo oscuro**.  
  - Se aplicó `select-none` para evitar selección accidental de la página.  
  - Mejor consistencia de colores y estilos en Tailwind CSS.

- **Refactorización de código**:  
  - Funciones largas o repetitivas (como `renderTask`) se modularizaron.  
  - Nombres de variables más descriptivos (`t` → `task`, `div` → `taskEl`).  
  - Helpers (`capitalize`, `priorityText`) simplificados y documentados con **JSDoc**.  
  - Contadores y validaciones centralizados para facilitar mantenimiento.

- **Uso de IA en desarrollo**:  
  - Cursor ayudó a mejorar **legibilidad, modularidad y consistencia**.  
  - Atajos más utilizados: `Ctrl+L`, `Ctrl+K`, `Ctrl+Shift+Y`.  
  - Cambios revisados manualmente antes de aceptarlos.
  
        ┌──────────────────────────────────────────────────────────┐
        │                   Lista de Tareas                    🌙 │
        └──────────────────────────────────────────────────────────┘
        ┌──────────────────────────────────────────────────────────┐    
        │      Contador     │             Añadir tarea             │ 
        │                   │               Buscador               │ 
        │                   │    Todas  Trabajo  Hogar  Personal   │ 
        └──────────────────────────────────────────────────────────┘
        ┌──────────────────────────────────────────────────────────┐      
        │                     tareas                               │
        └──────────────────────────────────────────────────────────┘