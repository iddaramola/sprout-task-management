import { Router } from "express";

import {
  getTasks,
  createTask,
  updateTaskStatus,
} from "../controllers/task.controller.js";

import {
  createTaskSchema,
  updateTaskStatusSchema,
  taskIdSchema,
  taskFilterSchema,
} from "../validators/task.validator.js";

import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../middleware/async-handler.js";

const router = Router();

router.get(
  "/",
  validate(taskFilterSchema, "query"),
  asyncHandler(getTasks)
);


router.post(
  "/",
  validate(createTaskSchema, "body"),
  asyncHandler(createTask)
);


router.patch(
  "/:id/status",
  validate(taskIdSchema, "params"),
  validate(updateTaskStatusSchema, "body"),
  asyncHandler(updateTaskStatus)
);

export default router;