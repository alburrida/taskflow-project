# TaskFlow

TaskFlow es una aplicación web de gestión de tareas con frontend en HTML, JavaScript y Tailwind CSS, y backend en Node.js con Express. Permite crear, editar, eliminar, completar y filtrar tareas mediante una API REST propia.

---

## Funcionalidades

### Frontend
- Crear tareas con título, categoría y prioridad
- Editar tareas existentes
- Marcar tareas como completadas o pendientes
- Eliminar tareas individualmente
- Completar o desmarcar todas las tareas
- Filtrar por categoría
- Buscar tareas por texto en tiempo real
- Mostrar contadores de tareas pendientes, completadas y totales
- Cambiar entre modo claro y modo oscuro
- Mostrar estados de red: carga, éxito y error
- Diseño responsive adaptado a móvil y escritorio

### Backend
- API RESTful para gestionar tareas
- Arquitectura por capas
- Validación manual de datos
- Middleware de parseo JSON
- Middleware CORS
- Middleware personalizado de logging
- Middleware global de manejo de errores
- Variables de entorno con dotenv

---

## Tecnologías utilizadas

### Frontend
- HTML5
- JavaScript Vanilla
- Tailwind CSS
- Fetch API

### Backend
- Node.js
- Express
- cors
- dotenv
- nodemon

### Pruebas
- Thunder Client

---

## Estructura del proyecto

taskflow-project/
├── index.html
├── app.js
├── src/
│   └── api/
│       └── client.js
├── docs/
│   └── backend-api.md
├── server/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── src/
│       ├── config/
│       │   └── env.js
│       ├── controllers/
│       │   └── task.controller.js
│       ├── middlewares/
│       │   └── logger.middleware.js
│       ├── routes/
│       │   └── task.routes.js
│       ├── services/
│       │   └── task.service.js
│       └── index.js
└── README.md

# Arquitectura Backend

El backend se ha organizado siguiendo una arquitectura por capas para separar responsabilidades y facilitar el mantenimiento del código.

## Routes

La capa de rutas conecta cada endpoint HTTP con su controlador correspondiente. No contiene lógica de negocio.

## Controllers

Los controladores reciben la petición HTTP, extraen parámetros y datos del body, validan la entrada y llaman a la capa de servicios. Después, construyen la respuesta HTTP.

## Services

La capa de servicios contiene la lógica de negocio de la aplicación. En esta práctica, las tareas se almacenan en memoria mediante un array, simulando persistencia temporal.

## Config

La configuración del entorno se gestiona en un módulo independiente que carga variables con dotenv y valida que existan antes de arrancar el servidor.

## Middlewares

Los middlewares permiten interceptar y procesar peticiones y respuestas antes de llegar a la lógica principal.

## Middlewares utilizados

**express.json()**

Convierte el cuerpo de las peticiones JSON en un objeto JavaScript accesible desde req.body.

**cors()**

Permite la comunicación entre el frontend y el backend aunque se ejecuten en orígenes distintos.

**loggerAcademico**

Middleware personalizado que registra en consola:

- método HTTP

- ruta

- código de estado

- duración de la petición

## Middleware global de errores

Captura errores no controlados. Si el error es **NOT_FOUND**, devuelve un **404**. Para cualquier otro error devuelve un **500**.

## Validaciones implementadas

El backend rechaza peticiones inválidas con `400 Bad Request` si:

- `text` no existe
- `text` tiene menos de 3 caracteres
- `text` supera los 100 caracteres
- `category` no es `trabajo`, `hogar` o `personal`
- `priority` no es `high`, `medium` o `low`
- `completed` no es booleano cuando corresponde

## Manejo de errores

- Si una tarea no existe, el servicio lanza `Error('NOT_FOUND')`.
- El middleware global transforma ese error en `404 Not Found`.
- Los errores no controlados devuelven `500 Internal Server Error`.

## Cómo ejecutar el proyecto

### 1. Backend

Entra en `server/` e instala dependencias:

```bash
cd server
npm install
```

Crea el archivo `.env` tomando como referencia `.env.example`:

```env
PORT=3000
```

Arranca el backend en desarrollo:

```bash
npm run dev
```

### 2. Frontend

Abre el frontend con una extensión tipo **Live Server** o cualquier servidor estático.

Ejemplo con VS Code:
- abrir `index.html`
- lanzar **Open with Live Server**

El frontend llamará al backend local en:

```text
http://localhost:3000/api/v1
```

## Cambios en el frontend

Antes:
- las tareas se guardaban en `localStorage`
- toda la lógica era local al navegador

Ahora:
- las tareas se piden al backend con `fetch`
- las operaciones crear, editar, borrar y completar son llamadas HTTP
- la UI muestra feedback de carga, éxito y error

## Pruebas recomendadas con Postman o Thunder Client

### Caso correcto
- `GET /api/v1/tasks`
- `POST /api/v1/tasks` con body válido
- `DELETE /api/v1/tasks/:id` de una tarea existente

### Casos de error
- `POST /api/v1/tasks` sin `text`
- `POST /api/v1/tasks` con `category: "estudios"`
- `PATCH /api/v1/tasks/complete-all` con `completed: "si"`
- `DELETE /api/v1/tasks/:id` con un ID inexistente


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

- La tarea debe tener **entre 3 y 15 caracteres**
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

Durante el desarrollo se han utilizado herramientas de IA como apoyo para:

- refactorizar funciones

- mejorar la organización del código

- detectar errores

- proponer mejoras de interfaz

- ayudar en la redacción de documentación técnica

Todos los cambios sugeridos fueron **revisados manualmente antes de incorporarlos al proyecto**.

---

# Despliegue

La aplicación se puede desplegar fácilmente en **Vercel**.

# Mejoras pendientes

Mejoras que se esperan añadir en un futuro:

- Mejora de la interfaz
- Elecciónn entre varios temas disponibles
- Descripción para cada tarea
- Compatibilidad para exportar tareas a google calendar