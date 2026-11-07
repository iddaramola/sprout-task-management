import TaskItem from "./TaskItem";

function TaskList({ tasks, onStatusChange, updatingTaskId }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <h3>No tasks found</h3>
        <p>Create a task or change your filter.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onStatusChange={onStatusChange}
          isUpdating={updatingTaskId === task.id}
        />
      ))}
    </div>
  );
}

export default TaskList;