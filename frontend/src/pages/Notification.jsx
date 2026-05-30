import { useEffect, useState } from "react";
import API from "../lib/api";

const Notifications = () => {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const res = await API.get("/tasks/upcoming");
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching upcoming tasks:", err);
      }
    };
    fetchUpcoming();
  }, []);

  return (
    <div className="relative">
      {/* Bell icon with badge */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        🔔
        {tasks.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-1">
            {tasks.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
      absolute right-0 mt-2 
      w-full sm:w-80 md:w-96 
      bg-white dark:bg-gray-700 
      border rounded shadow-lg z-50
    "
        >
          {tasks.length === 0 ? (
            <p className="p-2 text-gray-500 dark:text-gray-300">
              🎉 No upcoming deadlines
            </p>
          ) : (
            <div className="max-h-64 overflow-y-auto">
              {tasks.map((t) => (
                <div
                  key={t._id}
                  className="p-2 border-b border-gray-200 dark:border-gray-600"
                >
                  <p className="font-semibold">{t.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Due: {new Date(t.dueDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}


    </div>
  );
};

export default Notifications;
