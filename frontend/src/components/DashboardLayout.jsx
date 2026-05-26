import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/useAuth";

const DashboardLayout = () => {
  const { logout } = useAuth();
  const [deadlinesCount, setDeadlinesCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [upcomingTasks, setUpcomingTasks] = useState([]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between bg-white shadow px-6 py-4 relative">
          <h1 className="text-xl font-bold text-indigo-600">Nexus Dashboard</h1>
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <Button
                variant="outline"
                className="relative cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                Notifications
                {deadlinesCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 rounded-full">
                    {deadlinesCount}
                  </span>
                )}
              </Button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded z-50">
                  {upcomingTasks.length === 0 ? (
                    <p className="p-2 text-gray-500">No upcoming deadlines</p>
                  ) : (
                    upcomingTasks.map((t) => (
                      <div key={t._id} className="p-2 border-b">
                        <p className="font-semibold">{t.title}</p>
                        <p className="text-xs text-gray-500">
                          Due: {new Date(t.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Logout */}
            <Button onClick={logout}>Logout</Button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {/* Pass setters down so Dashboard can update */}
          <Outlet context={{ setDeadlinesCount, setUpcomingTasks }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
