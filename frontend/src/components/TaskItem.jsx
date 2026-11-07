function TaskItem({ task, onStatusChange, isUpdating }) {
  return (
    <article className="task-item">
      <div className="task-content">
        <h3>{task.title}</h3>

        {task.description && (
          <p>{task.description}</p>
        )}

        <small>
          Created: {new Date(task.created_at).toLocaleString()}
        </small>
      </div>

      <div className="task-actions">
        <span className={`status status-${task.status
          .toLowerCase()
          .replace(" ", "-")}`}>
          {task.status}
        </span>

        <select
          value={task.status}
          disabled={isUpdating}
          onChange={(event) =>
            onStatusChange(task.id, event.target.value)
          }
          aria-label={`Change status for ${task.title}`}
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
    </article>
  );
}

export default TaskItem;