import React from "react";
import { Skeleton } from "../components/ui/skeleton";

const STATUS_STYLES = {
  "To-Do":       "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  "In Progress": "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  "Done":        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
};

const PRIORITY_STYLES = {
  "High":   "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300",
  "Medium": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  "Low":    "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
};

const TaskList = ({ tasks, loading }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800"
          >
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <p className="text-gray-400 dark:text-gray-500 text-sm py-4 text-center">
        No tasks yet.
      </p>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
        Tasks
      </h2>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task._id}
            // FIX: added dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100
            className="flex flex-wrap justify-between items-center gap-2
              bg-white dark:bg-gray-800
              border border-gray-200 dark:border-gray-700
              text-gray-900 dark:text-gray-100
              shadow-sm hover:shadow-md transition-shadow
              p-4 rounded-xl"
          >
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-medium truncate">{task.title}</span>
              {task.description && (
                <span className="text-xs text-gray-400 dark:text-gray-500 truncate">
                  {task.description}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {task.priority && (
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    PRIORITY_STYLES[task.priority] ?? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {task.priority}
                </span>
              )}
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  STATUS_STYLES[task.status] ?? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {task.status || "Pending"}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;