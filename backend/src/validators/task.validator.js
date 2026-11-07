import { z } from "zod";

export const taskStatusSchema = z.enum([
  "Pending",
  "In Progress",
  "Completed",
]);

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(255, "Title cannot exceed 255 characters"),

  description: z
    .string()
    .max(5000, "Description cannot exceed 5000 characters")
    .optional(),
}).strict();

export const updateTaskStatusSchema = z.object({
  status: taskStatusSchema,
}).strict();

export const taskIdSchema = z.object({
  id: z.string().uuid("Invalid task ID"),
}).strict();

export const taskFilterSchema = z.object({
  status: taskStatusSchema.optional(),
}).strict();