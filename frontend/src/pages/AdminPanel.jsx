import { useEffect, useState } from "react";
import API from "../lib/api";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

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

  const fetchStats = async (id) => {
    try {
      const res = await API.get(`/admin/users/${id}/stats`);
      return res.data;
    } catch (err) {
      console.error("Stats fetch error:", err);
      return { projectsCount: 0, tasksCount: 0 };
    }
  };

  const updateRole = async (id, role) => {
    try {
      const res = await API.put(`/admin/users/${id}/role`, { role });
      setUsers(users.map((u) => (u._id === id ? res.data : u)));
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
      setUsers([...users, res.data]); // add new admin to table
      alert(`Admin ${res.data.name} created successfully`);
      setNewName(""); setNewEmail(""); setNewPassword("");
    } catch (err) {
      console.error("Admin creation error:", err);
      alert("Failed to create admin");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>

      {/* Create Admin Form */}
      <div className="mb-6 border p-4 rounded-md bg-gray-50">
        <h3 className="text-xl font-semibold mb-2">Create New Admin</h3>
        <div className="flex flex-col gap-2 max-w-sm">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Admin name"
            className="px-3 py-2 border rounded-md"
          />
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Admin email"
            className="px-3 py-2 border rounded-md"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Admin password"
            className="px-3 py-2 border rounded-md"
          />
          <button
            onClick={createAdmin}
            className="bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Create Admin
          </button>
        </div>
      </div>

      {/* User Table */}
      <table className="w-full border text-center">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Projects</th>
            <th className="p-2">Tasks</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t">
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.role}</td>
              <td className="p-2">{u.projectsCount ?? 0}</td>
              <td className="p-2">{u.tasksCount ?? 0}</td>
              <td className="p-2 flex justify-center gap-2">
                <button
                  onClick={() => updateRole(u._id, "Admin")}
                  className="px-3 py-1.5 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Make Admin
                </button>
                <button
                  onClick={() => updateRole(u._id, "User")}
                  className="px-3 py-1.5 rounded-md text-sm font-medium bg-gray-600 text-white hover:bg-gray-700"
                >
                  Make User
                </button>
                <button
                  onClick={() => deleteUser(u._id)}
                  className="px-3 py-1.5 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
