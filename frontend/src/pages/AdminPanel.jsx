import { useEffect, useState } from "react";
import API from "../lib/api";
import { toast } from 'sonner';
import ConfirmDialog from "#components/ConfirmDialog";

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

  // ── Confirmation dialog state ──
  const [confirmState, setConfirmState] = useState({
    open: false,
    title: "",
    description: "",
    confirmText: "Confirm",
    destructive: false,
    onConfirm: () => {},
  });

  const closeConfirm = () => setConfirmState((prev) => ({ ...prev, open: false }));

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

  // ── Role change: opens confirmation, actual API call inside onConfirm ──
  const confirmUpdateRole = (user, role) => {
    if (user.role === role) return; // already that role, nothing to do

    setConfirmState({
      open: true,
      title: role === "Admin" ? "Make this user an Admin?" : "Make this user a regular User?",
      description:
        role === "Admin"
          ? `${user.name} will gain full admin access, including managing other users.`
          : `${user.name} will lose admin access.`,
      confirmText: role === "Admin" ? "Make Admin" : "Make User",
      destructive: false,
      onConfirm: async () => {
        try {
          const res = await API.put(`/admin/users/${user._id}/role`, { role });
          setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, ...res.data } : u)));
          toast.success(`${res.data.name} is now ${role === "Admin" ? "an Admin" : "a User"}`);
        } catch (err) {
          console.error("Role update error:", err);
          toast.error(err.response?.data?.message || "Failed to update role");
        } finally {
          closeConfirm();
        }
      },
    });
  };

  // ── Delete: opens confirmation, actual API call inside onConfirm ──
  const confirmDeleteUser = (user) => {
    setConfirmState({
      open: true,
      title: "Delete this user?",
      description: `"${user.name}" (${user.email}) will be permanently deleted. This cannot be undone.`,
      confirmText: "Delete User",
      destructive: true,
      onConfirm: async () => {
        try {
          await API.delete(`/admin/users/${user._id}`);
          setUsers((prev) => prev.filter((u) => u._id !== user._id));
          toast.success("User deleted successfully");
        } catch (err) {
          console.error("Delete user error:", err);
          toast.error(err.response?.data?.message || "Failed to delete user");
        } finally {
          closeConfirm();
        }
      },
    });
  };

  const createAdmin = async () => {
    try {
      const res = await API.post("/admin/create", {
        name: newName,
        email: newEmail,
        password: newPassword,
      });
      setUsers([...users, res.data]);
      toast.success(`Admin ${res.data.name} created successfully`);
      setNewName(""); setNewEmail(""); setNewPassword("");
    } catch (err) {
      console.error("Admin creation error:", err);
      toast.error("Failed to create admin");
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
          <input type="text" placeholder="Name" value={newName} onChange={(e) => setNewName(e.target.value)} className={inputCls} />
          <input type="email" placeholder="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className={inputCls} />
          <input type="password" placeholder="Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputCls} />
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
              {["Name", "Email", "Role", "Projects", "Tasks", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 whitespace-nowrap font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((u) => (
              <tr
                key={u._id}
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
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.role === "Admin"
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
                      onClick={() => confirmUpdateRole(u, "Admin")}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-lg transition-colors whitespace-nowrap"
                    >
                      Make Admin
                    </button>
                    <button
                      onClick={() => confirmUpdateRole(u, "User")}
                      className="px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white text-xs rounded-lg transition-colors whitespace-nowrap"
                    >
                      Make User
                    </button>
                    <button
                      onClick={() => confirmDeleteUser(u)}
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

      {/* Confirmation Dialog — shared for role change / delete */}
      <ConfirmDialog
        open={confirmState.open}
        onOpenChange={(open) => !open && closeConfirm()}
        title={confirmState.title}
        description={confirmState.description}
        confirmText={confirmState.confirmText}
        destructive={confirmState.destructive}
        onConfirm={confirmState.onConfirm}
      />
    </div>
  );
};

export default AdminPanel;