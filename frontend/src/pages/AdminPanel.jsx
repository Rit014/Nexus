import { useEffect, useState } from "react";
import API from "../lib/api";

const inputCls = `
  border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm
  bg-white dark:bg-gray-700
  text-gray-900 dark:text-gray-100
  placeholder-gray-400 dark:placeholder-gray-500
  focus:outline-none focus:ring-2 focus:ring-indigo-500
`.trim();

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const fetchStats = async (id) => {
    try {
      const res = await API.get(`/admin/users/${id}/stats`);
      return res.data;
    } catch {
      return { projectsCount: 0, tasksCount: 0 };
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/admin/users");
        const usersWithStats = await Promise.all(
          res.data.map(async (u) => {
            const stats = await fetchStats(u._id);
            return { ...u, ...stats };
          })
        );
        setUsers(usersWithStats);
      } catch (err) {
        console.error("Admin fetch error:", err);
      }
    };
    fetchUsers();
  }, []);

  const updateRole = async (id, role) => {
    try {
      const res = await API.put(`/admin/users/${id}/role`, { role });
      setUsers(users.map((u) => (u._id === id ? { ...u, ...res.data } : u)));
    } catch (err) {
      console.error("Role update error:", err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Delete user error:", err);
    }
  };

  const createAdmin = async () => {
    try {
      const res = await API.post("/admin/create", {
        name: newName,
        email: newEmail,
        password: newPassword,
      });
      setUsers([...users, res.data]);
      alert(`Admin ${res.data.name} created successfully`);
      setNewName(""); setNewEmail(""); setNewPassword("");
    } catch (err) {
      console.error("Admin creation error:", err);
      alert("Failed to create admin");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Admin Panel
      </h2>

      {/* ── Create Admin Form ── */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100">
          Create New Admin
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input type="text"      placeholder="Name"     value={newName}     onChange={(e) => setNewName(e.target.value)}     className={inputCls} />
          <input type="email"     placeholder="Email"    value={newEmail}    onChange={(e) => setNewEmail(e.target.value)}    className={inputCls} />
          <input type="password"  placeholder="Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputCls} />
        </div>
        <button
          onClick={createAdmin}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors"
        >
          Create Admin
        </button>
      </div>

      {/* ── User Table ── */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="min-w-full text-sm text-center">

          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            <tr>
              {["Name","Email","Role","Projects","Tasks","Actions"].map((h) => (
                <th key={h} className="px-4 py-3 whitespace-nowrap font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          {/* FIX: remove bg from tbody — set bg on every <tr> individually so
              browser focus/click never overrides with white */}
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((u) => (
              <tr
                key={u._id}
                // FIX: explicit bg on each row + real hover classes
                className="
                  bg-white dark:bg-gray-800
                  hover:bg-gray-50 dark:hover:bg-gray-700
                  text-gray-900 dark:text-gray-100
                  transition-colors
                "
              >
                <td className="px-4 py-3 whitespace-nowrap">{u.name}</td>
                <td className="px-4 py-3 whitespace-nowrap">{u.email}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      u.role === "Admin"
                        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3">{u.projectsCount ?? 0}</td>
                <td className="px-4 py-3">{u.tasksCount ?? 0}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-2 flex-wrap">
                    <button
                      onClick={() => updateRole(u._id, "Admin")}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-lg transition-colors whitespace-nowrap"
                    >
                      Make Admin
                    </button>
                    <button
                      onClick={() => updateRole(u._id, "User")}
                      className="px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white text-xs rounded-lg transition-colors whitespace-nowrap"
                    >
                      Make User
                    </button>
                    <button
                      onClick={() => deleteUser(u._id)}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-colors whitespace-nowrap"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr className="bg-white dark:bg-gray-800">
                <td colSpan={6} className="px-4 py-8 text-gray-400 dark:text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;