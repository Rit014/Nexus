import React from "react";

const TaskList = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return <p className="text-gray-500">No tasks yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li
          key={task._id}
          className="flex justify-between items-center bg-white shadow p-3 rounded"
        >
          <span>{task.title}</span>
          <span className="text-sm text-gray-400">
            {task.status || "Pending"}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
