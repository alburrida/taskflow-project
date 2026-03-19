# Backend API: herramientas relacionadas

## Axios

Axios es una librería cliente HTTP basada en promesas que puede usarse tanto en el navegador como en Node.js. Permite enviar peticiones a una API de forma sencilla, por ejemplo con métodos como `get`, `post`, `patch` o `delete`.

### ¿Para qué se usa?
Se usa para comunicar el frontend con un backend sin tener que trabajar directamente con APIs más bajas. Facilita el envío de datos en JSON, la gestión de respuestas y el tratamiento de errores.

### En este proyecto
En TaskFlow no se ha usado Axios, porque se ha trabajado con `fetch`, que ya viene integrada en el navegador. Aun así, Axios sería una alternativa válida para consumir la API REST del backend.

---

## Postman

Postman es una herramienta para trabajar con APIs. Permite enviar peticiones HTTP, ver respuestas, guardar colecciones de pruebas y documentar endpoints.

### ¿Para qué se usa?
Se usa para comprobar si una API funciona correctamente sin depender todavía del frontend. Es muy útil para probar:
- peticiones `GET`, `POST`, `PATCH` y `DELETE`
- envío de JSON en el cuerpo de la petición
- códigos de estado HTTP
- errores controlados

### En este proyecto
Aunque Postman es una de las herramientas más conocidas para probar APIs, en esta práctica se ha utilizado Thunder Client, una extensión de Visual Studio Code. Gracias a eso se han podido probar los endpoints del backend de TaskFlow y verificar casos como:

- crear una tarea válida
- intentar crear una tarea inválida
- borrar una tarea inexistente
- actualizar una tarea con datos incorrectos

## Sentry

Sentry es una plataforma de monitorización que permite detectar errores y problemas de rendimiento en aplicaciones.

### ¿Para qué se usa?
Se usa para registrar fallos que ocurren en producción, analizarlos y detectar problemas de rendimiento. También ayuda a saber en qué parte del sistema se originó un error.

### En este proyecto
En esta práctica no se ha integrado Sentry, pero sería útil si la aplicación creciera o se desplegara en producción, ya que permitiría registrar errores del frontend y del backend de forma centralizada.

---

## Swagger

Swagger está relacionado con OpenAPI, que es un estándar para describir APIs REST. Permite documentar de forma estructurada los endpoints, parámetros, respuestas y errores de una API.

### ¿Para qué se usa?
Se usa para:
- documentar la API de forma clara
- visualizar endpoints disponibles
- probar rutas desde una interfaz gráfica
- facilitar que otros desarrolladores entiendan cómo consumir la API

### En este proyecto
No se ha integrado Swagger en TaskFlow, pero sería una mejora útil para documentar la API REST de tareas y mostrar rutas como:
- `GET /api/v1/tasks`
- `POST /api/v1/tasks`
- `PATCH /api/v1/tasks/:id`
- `PATCH /api/v1/tasks/:id/toggle`
- `PATCH /api/v1/tasks/complete-all`
- `DELETE /api/v1/tasks/:id`

---

## Conclusión

Estas herramientas cumplen funciones distintas dentro del desarrollo backend:

- **Axios**: consumir APIs desde código.
- **Postman**: probar y depurar APIs manualmente.
- **Sentry**: monitorizar errores y rendimiento.
- **Swagger**: documentar APIs de forma profesional.

Aunque en este proyecto solo se ha usado directamente `fetch` para el consumo de la API y Thunder Client para las pruebas, conocer estas herramientas es importante porque forman parte del trabajo habitual en el desarrollo de aplicaciones web modernas.