import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/useAuth";
import API from "../lib/api";
import Notification from "../pages/Notification";

const DashboardLayout = () => {
  const { logout } = useAuth();
  const [deadlinesCount, setDeadlinesCount] = useState(0);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("dark-mode") === "true"
  );

  useEffect(() => {
    localStorage.setItem("dark-mode", darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const res = await API.get("/tasks/upcoming");
        setUpcomingTasks(res.data);
        setDeadlinesCount(res.data.length);
      } catch (err) {
        console.error("Error fetching upcoming tasks:", err);
      }
    };
    fetchUpcoming();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">

      {/* Desktop sidebar */}
      <div className="hidden md:flex h-full shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="absolute left-0 top-0 h-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Header */}
        <header className="shrink-0 flex items-center justify-between bg-white dark:bg-gray-800 shadow px-4 md:px-6 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="md:hidden p-2 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 shrink-0"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>
            <h1 className="text-base md:text-2xl font-bold text-indigo-600 dark:text-indigo-300 truncate">
              Nexus Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Notification />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </Button>
            <Button size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 text-gray-900 dark:text-gray-100">
          <Outlet context={{ setDeadlinesCount, setUpcomingTasks }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;