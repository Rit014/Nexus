import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/useAuth";
import API from "../lib/api";
import Notification from "../pages/Notification" // ✅ Correct import

const DashboardLayout = () => {
  const { logout } = useAuth();
  const [deadlinesCount, setDeadlinesCount] = useState(0);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("dark-mode");
    if (saved) setDarkMode(saved === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("dark-mode", darkMode);
  }, [darkMode]);

  // ✅ Fetch upcoming tasks once
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
    <div className={darkMode ? "dark flex h-screen" : "flex h-screen"}>
      {/* Sidebar desktop */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Sidebar mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
          <div className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300">
            <Sidebar />
            <button
              className="absolute top-2 right-2 text-gray-600 dark:text-gray-300"
              onClick={() => setSidebarOpen(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 bg-gray-50 dark:bg-gray-900">
        <header className="flex items-center justify-between bg-white dark:bg-gray-800 shadow px-6 py-4 relative">
          <h1 className="text-xl md:text-2xl font-bold text-indigo-600 dark:text-indigo-300">
            Nexus Dashboard
          </h1>
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded bg-gray-200 dark:bg-gray-700"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>

            {/* ✅ Notifications dropdown */}
            <Notification />

            {/* Dark mode toggle + logout */}
            <Button variant="outline" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </Button>
            <Button onClick={logout}>Logout</Button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto text-gray-900 dark:text-gray-100">
          <Outlet context={{ setDeadlinesCount, setUpcomingTasks }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
