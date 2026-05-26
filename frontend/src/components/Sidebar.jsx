import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { cn } from "../lib/utils";
import {
  HomeIcon,
  FolderIcon,
  ClipboardDocumentListIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) {
      setCollapsed(saved === "true");
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", collapsed);
  }, [collapsed]);

  return (
    <aside
      className={cn(
        "bg-slate-900 text-white flex flex-col min-h-screen p-4 transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center justify-between mb-6">
        {!collapsed && (
          <h2 className="text-lg font-bold cursor-pointer">Nexus</h2>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white"
        >
          {collapsed ? "➡️" : "⬅️"}
        </button>
      </div>

      <nav className="flex flex-col gap-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            cn(
              "px-4 py-2 rounded-md flex items-center gap-2 hover:bg-slate-700",
              isActive && "bg-indigo-600 font-semibold"
            )
          }
        >
          <HomeIcon className="w-5 h-5" />
          {!collapsed && "Dashboard"}
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) =>
            cn(
              "px-4 py-2 rounded-md flex items-center gap-2 hover:bg-slate-700",
              isActive && "bg-indigo-600 font-semibold"
            )
          }
        >
          <FolderIcon className="w-5 h-5" />
          {!collapsed && "Projects"}
        </NavLink>

        <NavLink
          to="/task"
          className={({ isActive }) =>
            cn(
              "px-4 py-2 rounded-md flex items-center gap-2 hover:bg-slate-700",
              isActive && "bg-indigo-600 font-semibold"
            )
          }
        >
          <ClipboardDocumentListIcon className="w-5 h-5" />
          {!collapsed && "Tasks"}
        </NavLink>

        {/* ✅ Case-insensitive role check */}
        {user?.role?.toLowerCase() === "admin" && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              cn(
                "px-4 py-2 rounded-md flex items-center gap-2 hover:bg-slate-700",
                isActive && "bg-indigo-600 font-semibold"
              )
            }
          >
            <ShieldCheckIcon className="w-5 h-5" />
            {!collapsed && "Admin Panel"}
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
