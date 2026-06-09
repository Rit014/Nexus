import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { cn } from "../lib/utils";
import {
  HomeIcon,
  FolderIcon,
  ClipboardDocumentListIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ onClose }) => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) setCollapsed(saved === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", collapsed);
  }, [collapsed]);

  const links = [
    {
      to: "/dashboard",
      icon: <HomeIcon className="w-5 h-5 shrink-0" />,
      label: "Dashboard",
    },
    {
      to: "/projects",
      icon: <FolderIcon className="w-5 h-5 shrink-0" />,
      label: "Projects",
    },
    {
      to: "/task",
      icon: <ClipboardDocumentListIcon className="w-5 h-5 shrink-0" />,
      label: "Tasks",
    },
    ...(user?.role?.toLowerCase() === "admin"
      ? [
          {
            to: "/admin",
            icon: <ShieldCheckIcon className="w-5 h-5 shrink-0" />,
            label: "Admin Panel",
          },
        ]
      : []),
  ];

  return (
    <aside
      className={cn(
        "bg-slate-900 text-white flex flex-col h-full transition-all duration-300 overflow-hidden",
        // FIX: use exact pixel widths so parent layout reflows correctly
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 mb-2">
        {!collapsed && (
          <h2 className="text-lg font-bold truncate">Nexus</h2>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white ml-auto shrink-0"
          aria-label="Toggle sidebar"
        >
          {collapsed ? "➡️" : "⬅️"}
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 px-2">
        {links.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            // FIX: call onClose when a link is clicked on mobile
            onClick={() => onClose?.()}
            className={({ isActive }) =>
              cn(
                "px-3 py-2 rounded-md flex items-center gap-2 hover:bg-slate-700 transition-colors",
                isActive && "bg-indigo-600 font-semibold",
                collapsed && "justify-center px-2"
              )
            }
          >
            {icon}
            {!collapsed && <span className="truncate text-sm">{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;