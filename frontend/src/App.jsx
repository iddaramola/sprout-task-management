import { useCallback, useEffect, useState } from "react";

import {
  getTasks,
  updateTaskStatus,
} from "./services/taskApi";

import TaskList from "./components/TaskList";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTasks(statusFilter);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function handleStatusChange(taskId, newStatus) {
    try {
      setError("");
      setUpdatingTaskId(taskId);

      const updatedTask = await updateTaskStatus(
        taskId,
        newStatus
      );

      setTasks((currentTasks) => {
         if (statusFilter && newStatus !== statusFilter) {
         return currentTasks.filter((task) => task.id !== taskId);
         }

         return currentTasks.map((task) =>
         task.id === taskId ? updatedTask : task
        );
     });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingTaskId(null);
    }
  }

  return (
    <main className="container">
      <header className="page-header">
        <div>
          <h1>Task Management</h1>
          <p>Organize and track your work.</p>
        </div>
      </header>

      <section className="tasks-section">
        <div className="section-header">
          <h2>Tasks</h2>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            aria-label="Filter tasks by status"
          >
            <option value="">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <p className="loading-state">Loading tasks...</p>
        ) : (
          <TaskList
            tasks={tasks}
            onStatusChange={handleStatusChange}
            updatingTaskId={updatingTaskId}
          />
        )}

        {updatingTaskId && (
          <p className="loading-state">
            Updating task...
          </p>
        )}
      </section>
    </main>
  );
}

export default App;