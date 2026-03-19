const API_BASE_URL = "http://localhost:3000/api/v1/tasks";

async function handleResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error en la petición");
  }

  return data;
}

async function getTasks() {
  const response = await fetch(API_BASE_URL);
  return handleResponse(response);
}

async function createTask(taskData) {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });

  return handleResponse(response);
}

async function updateTask(id, taskData) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });

  return handleResponse(response);
}

async function toggleTask(id) {
  const response = await fetch(`${API_BASE_URL}/${id}/toggle`, {
    method: "PATCH",
  });

  return handleResponse(response);
}

async function completeAllTasksRequest() {
  const response = await fetch(`${API_BASE_URL}/complete-all`, {
    method: "PATCH",
  });

  return handleResponse(response);
}

async function deleteTaskRequest(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });

  return handleResponse(response);
}

window.taskApi = {
  getTasks,
  createTask,
  updateTask,
  toggleTask,
  completeAllTasksRequest,
  deleteTaskRequest,
};