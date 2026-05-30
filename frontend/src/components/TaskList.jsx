import React from "react";
import { Skeleton } from "../components/ui/skeleton"

const TaskList = ({ tasks, loading }) => {

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 border rounded bg-white dark:bg-gray-800">
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        ))}
      </div>
    );
  }

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
