import { useState } from "react";
import { createTask } from "../services/taskApi";

function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    // Client-side validation
    if (!trimmedTitle) {
      setError("Task title is required.");
      return;
    }

    if (trimmedTitle.length > 255) {
      setError("Task title cannot exceed 255 characters.");
      return;
    }

    if (description.length > 5000) {
      setError("Description cannot exceed 5000 characters.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const newTask = await createTask({
        title: trimmedTitle,
        description: description.trim(),
      });

      
      onTaskCreated(newTask);

    
      setTitle("");
      setDescription("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="task-form-section">
      <h2>Create a task</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter task title"
            maxLength={255}
            required
          />

          <small>{title.length}/255 characters</small>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>

          <textarea
            id="description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Enter task description (optional)"
            maxLength={5000}
            rows={4}
          />

          <small>{description.length}/5000 characters</small>
        </div>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create task"}
        </button>
      </form>
    </section>
  );
}

export default TaskForm;