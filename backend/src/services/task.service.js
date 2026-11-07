import * as taskRepository from "../repositories/task.repository.js";

export async function getTasks(status) {
  return taskRepository.findAll(status);
}

export async function createTask(task) {
  return taskRepository.create(task);
}

export async function changeTaskStatus(id, status) {
  const task = await taskRepository.updateStatus(id, status);

  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;

    throw error;
  }

  return task;
}