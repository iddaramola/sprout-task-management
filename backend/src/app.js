import "dotenv/config";
import express from "express";
import cors from "cors";

import taskRoutes from "./routes/task.routes.js";

import {
  notFound,
  errorHandler,
} from "./middleware/error-handler.js";

const app = express();

app.use(express.json({ limit: "1mb" }));

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);


app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Task Management API is running",
  });
});


app.use("/api/tasks", taskRoutes);


app.use(notFound);
app.use(errorHandler);

export default app;