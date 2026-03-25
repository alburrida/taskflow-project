# 🖥 TaskFlow — Documentación técnica del servidor

Documentación técnica del backend de **TaskFlow**, centrada en su arquitectura, flujo de peticiones, modelo de datos y diseño de la API REST.

---

## Tabla de contenidos

1. Infraestructura del servidor
2. Arquitectura por capas
3. Middlewares
4. Modelo de datos
5. API REST
6. Capa de red del frontend
7. Validación y manejo de errores
8. Persistencia actual
9. Pruebas y despliegue
10. Conclusión técnica

---

## Infraestructura del servidor

### Estructura de carpetas

```text
taskflow-project/
├── .env
├── package.json
├── vercel.json
├── public/
│   ├── index.html
│   ├── app.js
│   └── api/
│       └── client.js
└── src/
    ├── index.js
    ├── config/
    │   └── env.js
    ├── controllers/
    │   └── task.controller.js
    ├── middlewares/
    │   └── logger.middleware.js
    ├── routes/
    │   └── task.routes.js
    └── services/
        └── task.service.js
```

### Objetivo de la estructura

El backend se ha organizado para separar claramente responsabilidades y evitar mezclar en un mismo archivo la definición de rutas, la validación de datos y la lógica de negocio.

La estructura distingue entre:

- **`public/`**: frontend servido por la aplicación.
- **`src/routes/`**: definición de endpoints HTTP.
- **`src/controllers/`**: coordinación entre petición y respuesta.
- **`src/services/`**: lógica de negocio.
- **`src/middlewares/`**: lógica transversal del servidor.
- **`src/config/`**: configuración del entorno.

Esta organización mejora la mantenibilidad, facilita la lectura del proyecto y permite ampliar funcionalidades sin desordenar la base del backend.

## Arquitectura por capas

El backend sigue una arquitectura por capas sencilla:

```text
Cliente → Routes → Controllers → Services
```

### Routes
La capa de rutas define los endpoints y conecta cada uno con su controlador correspondiente.

Ejemplos:
- `GET /api/v1/tasks`
- `POST /api/v1/tasks`
- `PATCH /api/v1/tasks/:id`
- `PATCH /api/v1/tasks/:id/toggle`
- `PATCH /api/v1/tasks/complete-all`
- `DELETE /api/v1/tasks/:id`

Las rutas no implementan lógica de negocio. Su función es recibir la petición y delegarla.

### Controllers
Los controladores:
- leen `req.params` y `req.body`
- validan los datos de entrada
- llaman a la capa de servicios
- construyen la respuesta HTTP

Actúan como puente entre el protocolo HTTP y la lógica interna de la aplicación.

### Services
La capa de servicios concentra la lógica de negocio:
- obtener tareas
- crear tareas
- actualizar tareas
- eliminar tareas
- alternar el estado de completado
- completar o desmarcar todas

El servicio no depende de `req` ni de `res`, lo que evita acoplar la lógica funcional a Express.

### Ventajas de esta separación

- **mantenibilidad**: cada capa tiene una responsabilidad concreta
- **claridad**: el flujo de una petición resulta más fácil de seguir
- **escalabilidad**: permite añadir nuevas funcionalidades sin reescribir el backend completo
- **menor acoplamiento**: cambios en la API HTTP no obligan a modificar toda la lógica de negocio

## Middlewares

Los middlewares permiten ejecutar lógica común durante el ciclo de vida de una petición HTTP antes de llegar al controlador o antes de enviar la respuesta final.

### `cors()`
Permite que el navegador pueda realizar peticiones al backend desde un origen distinto durante el desarrollo.

Fue útil mientras frontend y backend podían ejecutarse en orígenes separados, por ejemplo:
- frontend en `localhost:5500`
- backend en `localhost:3000`

### `express.json()`
Parsea cuerpos JSON y los expone en `req.body`.

Sin este middleware, el backend no podría leer correctamente los datos enviados en peticiones `POST` o `PATCH`.

### `loggerAcademico`
Middleware personalizado que registra en consola:
- método HTTP
- ruta solicitada
- código de estado
- duración aproximada de la petición

Ejemplo:

```text
[GET] /api/v1/tasks - Estado: 200 (3ms)
```

Su objetivo es aportar trazabilidad básica durante el desarrollo y facilitar la depuración.

### Middleware global de errores
Middleware final encargado de capturar errores no controlados en controladores o servicios.

Comportamiento principal:
- `NOT_FOUND` → respuesta `404`
- cualquier otro error → respuesta `500`

### Orden de aplicación
El flujo general del servidor sigue este orden:

1. `cors()`
2. `express.json()`
3. `loggerAcademico`
4. rutas de la API
5. middleware global de errores

Este orden asegura que:
- las peticiones puedan entrar correctamente
- el cuerpo JSON esté disponible cuando llegue al controlador
- cada petición quede registrada
- los errores queden capturados al final del ciclo

## Modelo de datos

La entidad principal del backend es la **tarea**.

### Estructura de una tarea

```json
{
  "id": 1,
  "title": "Hacer la práctica",
  "category": "trabajo",
  "priority": "high",
  "completed": false,
  "createdAt": "2026-03-25T10:00:00.000Z"
}
```

### Campos del modelo

| Campo       | Tipo    | Descripción |
|------------|---------|-------------|
| `id`       | number  | Identificador autoincremental |
| `title`    | string  | Título de la tarea |
| `category` | string  | Categoría funcional |
| `priority` | string  | Prioridad (`high`, `medium`, `low`) |
| `completed`| boolean | Estado de completado |
| `createdAt`| string  | Fecha de creación en formato ISO 8601 |

### Decisiones de diseño

- El `id` se genera automáticamente en el servidor.
- `completed` se modela como booleano para simplificar la lógica.
- `createdAt` se almacena en formato ISO para mantener consistencia temporal.
- El frontend y el backend comparten prácticamente la misma estructura de tarea, lo que reduce transformaciones innecesarias.

### Persistencia del modelo

Las tareas no se almacenan en una base de datos, sino en un array en memoria dentro de la capa de servicios.

#### Implicaciones técnicas
- los datos existen mientras el servidor siga activo
- al reiniciar el proceso, las tareas se pierden
- no hay persistencia duradera

## API REST

La API del backend de TaskFlow sigue un enfoque REST básico, utilizando cada verbo HTTP según su finalidad sobre el recurso `tasks`.

### Base URL
**Desarrollo local:** `http://localhost:3000/api/v1/tasks`

### Endpoints principales

#### `GET /api/v1/tasks`
Devuelve la lista completa de tareas almacenadas en memoria.

Respuesta típica:

```json
[
  {
    "id": 1,
    "title": "Hacer la práctica",
    "category": "trabajo",
    "priority": "high",
    "completed": false,
    "createdAt": "2026-03-25T10:00:00.000Z"
  }
]
```

Si no hay tareas registradas, devuelve:

```json
[]
```

#### `POST /api/v1/tasks`
Crea una nueva tarea.

Body de ejemplo:

```json
{
  "title": "Hacer la práctica",
  "category": "trabajo",
  "priority": "high"
}
```

Respuesta `201 Created`:

```json
{
  "id": 1,
  "title": "Hacer la práctica",
  "category": "trabajo",
  "priority": "high",
  "completed": false,
  "createdAt": "2026-03-25T10:00:00.000Z"
}
```

#### `PATCH /api/v1/tasks/:id`
Actualiza parcialmente una tarea existente.

Ejemplo de body:

```json
{
  "title": "Terminar la práctica",
  "priority": "medium"
}
```

#### `PATCH /api/v1/tasks/:id/toggle`
Alterna el estado de completado de una tarea concreta.

- si estaba pendiente, pasa a completada
- si estaba completada, pasa a pendiente

#### `PATCH /api/v1/tasks/complete-all`
Alterna el estado global de todas las tareas.

- si no todas están completadas, las marca todas como completadas
- si todas están completadas, las marca todas como pendientes

#### `DELETE /api/v1/tasks/:id`
Elimina una tarea por identificador.

Respuesta correcta: `204 No Content`.

#### `GET /api/health`
Endpoint simple de comprobación del estado del servidor.

Respuesta:

```json
{
  "ok": true
}
```

### Códigos HTTP utilizados

| Código | Significado | Uso en TaskFlow |
|--------|-------------|-----------------|
| `200`  | OK | Lectura o modificación correcta |
| `201`  | Created | Creación correcta |
| `204`  | No Content | Eliminación correcta |
| `400`  | Bad Request | Datos inválidos |
| `404`  | Not Found | Recurso inexistente |
| `500`  | Internal Server Error | Error inesperado |

### Coherencia REST

La API se ha diseñado respetando criterios REST básicos:

- `GET` para lectura
- `POST` para creación
- `PATCH` para modificaciones parciales
- `DELETE` para eliminación

Esto mejora la claridad del contrato HTTP y hace que el sistema sea más fácil de entender y probar.

## Capa de red del frontend

La comunicación entre frontend y backend se centraliza en:

```text
public/api/client.js
```

### Responsabilidades de `client.js`

- centralizar la URL base de la API
- encapsular llamadas `fetch`
- procesar respuestas HTTP
- lanzar errores controlados cuando la respuesta no es válida

### Funciones implementadas

- `getTasks()`
- `createTask(taskData)`
- `updateTask(id, taskData)`
- `toggleTask(id)`
- `completeAllTasksRequest()`
- `deleteTaskRequest(id)`

Esta capa evita que la interfaz dependa directamente de detalles concretos del protocolo HTTP y simplifica el mantenimiento del frontend.

### Estados de red en la interfaz

La interfaz contempla tres estados visuales asociados a las operaciones de red:

- **carga**: mientras la petición está en curso
- **éxito**: cuando la operación se completa correctamente
- **error**: cuando la API devuelve una respuesta no válida o falla la petición

## Validación y manejo de errores

### Validaciones implementadas

El servidor comprueba, entre otras cosas:

- presencia de campos obligatorios
- tipo de dato correcto
- longitud mínima del título
- validez del identificador recibido por parámetro
- existencia de al menos un campo al actualizar una tarea

Estas comprobaciones evitan que datos inválidos lleguen a la lógica interna del sistema.

### Errores contemplados

El backend responde con distintos códigos HTTP según el tipo de problema detectado:

- **`400 Bad Request`**: datos inválidos enviados por el cliente
- **`404 Not Found`**: tarea no encontrada
- **`500 Internal Server Error`**: error inesperado del servidor

### Objetivo de este diseño

El objetivo es que el cliente reciba respuestas coherentes, previsibles y útiles, sin exponer detalles internos del servidor.

Por este motivo:

- los errores de validación se responden con mensajes controlados
- los errores inesperados se registran en consola
- no se envían trazas internas ni detalles sensibles al cliente

### Beneficio técnico

Este enfoque mejora:
- la robustez del backend
- la claridad del contrato API
- la seguridad básica de la aplicación
- la facilidad para depurar fallos durante el desarrollo

## Persistencia actual

Actualmente, TaskFlow utiliza un **array en memoria** como mecanismo de almacenamiento temporal para las tareas.

### Funcionamiento

Las tareas se guardan dentro de la capa de servicios mientras el proceso del servidor siga activo. No existe una base de datos ni un sistema de persistencia externa.

### Implicaciones técnicas

- las tareas se mantienen mientras el servidor esté encendido
- al reiniciar el proceso, las tareas se pierden
- no existe persistencia duradera
- no hay sincronización entre múltiples instancias del servidor

## Pruebas y despliegue

### Pruebas

Durante el desarrollo se utilizó **Thunder Client** para comprobar el comportamiento de la API y validar que cada endpoint respondiera correctamente.

### Casos probados

Se verificaron, entre otros, los siguientes escenarios:

- listar tareas con el servidor recién iniciado
- crear tareas válidas
- editar tareas existentes
- marcar y desmarcar tareas como completadas
- completar o desmarcar todas las tareas
- eliminar tareas existentes
- intentar crear tareas con datos inválidos
- intentar operar sobre identificadores inexistentes

### Objetivo de las pruebas

Estas comprobaciones permitieron verificar:

- respuestas HTTP correctas
- códigos de estado adecuados
- validaciones de entrada
- funcionamiento del middleware global de errores
- integración correcta entre frontend y backend

---

### Despliegue

El proyecto se ha adaptado para funcionar como una única aplicación desplegada en **Vercel**, sirviendo:

- frontend desde `public/`
- backend Express desde `src/`

### Ejecución en local

```bash
npm run dev
```

Acceso local:

```text
http://localhost:3000
```

### Observaciones técnicas

- En desarrollo, Express sirve el frontend y la API desde el mismo servidor.
- En producción, el proyecto se despliega como una única aplicación.
- La API queda accesible bajo rutas `/api/...`.
- La persistencia sigue siendo temporal, ya que el almacenamiento continúa en memoria.
