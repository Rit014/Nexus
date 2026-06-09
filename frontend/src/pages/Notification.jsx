import { useEffect, useRef, useState } from "react";
import API from "../lib/api";

const Notification = () => {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dropdownContent = (
    <>
      <div className="p-3 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
        <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-200">
          Upcoming Deadlines
        </h3>
        {/* close button — useful on mobile */}
        <button
          onClick={() => setOpen(false)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg leading-none"
          aria-label="Close notifications"
        >
          ✕
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center">
          🎉 No upcoming deadlines
        </p>
      ) : (
        <div className="max-h-64 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
          {tasks.map((t) => (
            <div key={t._id} className="p-3">
              <p className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate">
                {t.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Due: {new Date(t.dueDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );

  return (
    <div className="relative" ref={ref}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        aria-label="Notifications"
      >
        🔔
        {tasks.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {tasks.length}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* ── Mobile: full-width panel pinned to top of screen ── */}
          <div className="sm:hidden fixed top-14 left-2 right-2 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl">
            {dropdownContent}
          </div>

          {/* ── Desktop: normal absolute dropdown ── */}
          <div className="hidden sm:block absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl z-50">
            {dropdownContent}
          </div>
        </>
      )}
    </div>
  );
};

export default Notification;