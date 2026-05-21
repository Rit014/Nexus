"use client"

import React from "react"
import { NavLink } from "react-router-dom"
import { useAuth } from "../context/useAuth";
import { cn } from "../lib/utils"

const Sidebar = () => {
  const { user } = useAuth()

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col p-4">
      <h2 className="text-lg font-bold mb-6">Nexus</h2>

      <nav className="flex flex-col gap-2">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            cn(
              "px-4 py-2 rounded-md hover:bg-slate-700",
              isActive && "bg-indigo-600"
            )
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) =>
            cn(
              "px-4 py-2 rounded-md hover:bg-slate-700",
              isActive && "bg-indigo-600"
            )
          }
        >
          Projects
        </NavLink>

        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            cn(
              "px-4 py-2 rounded-md hover:bg-slate-700",
              isActive && "bg-indigo-600"
            )
          }
        >
          Tasks
        </NavLink>

        {user?.role === "admin" && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              cn(
                "px-4 py-2 rounded-md hover:bg-slate-700",
                isActive && "bg-indigo-600"
              )
            }
          >
            Admin Panel
          </NavLink>
        )}

      </nav>
    </aside>
  )
}

export default Sidebar;