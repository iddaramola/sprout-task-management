import * as taskService from "../services/task.service.js";

export async function getTasks(req, res) {
  const { status } = req.validated.query;

  const tasks = await taskService.getTasks(status);

  return res.status(200).json({
    success: true,
    data: tasks,
  });
}

export async function createTask(req, res) {
  const task = await taskService.createTask(
    req.validated.body
  );

  return res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: task,
  });
}

export async function updateTaskStatus(req, res) {
  const { id } = req.validated.params;
  const { status } = req.validated.body;

  const task = await taskService.changeTaskStatus(
    id,
    status
  );

  return res.status(200).json({
    success: true,
    message: "Task status updated successfully",
    data: task,
  });
}