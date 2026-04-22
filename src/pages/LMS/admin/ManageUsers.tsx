import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageMeta from "../../../components/common/PageMeta";

interface User {
  id: string | number;
  _id?: string | number; // Added to support backends using _id
  name?: string;
  email?: string;
  role?: string;
  status?: string;
}

export default function ManageUsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  useEffect(() => {
    const token = localStorage.getItem("token"); // Assuming tokens are stored here

    fetch("http://localhost:8080/api/users", {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server returned ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        console.log("User Data Received:", data);
        // Handle cases where API returns { users: [] } instead of []
        const usersList = Array.isArray(data) ? data : data.users || [];
        setUsers(usersList);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setError(err.message || "Could not connect to the server.");
        setIsLoading(false);
      });
  }, []);

  const handleDelete = async (user: User) => {
    const targetId = user.id || user._id;
    if (!targetId || targetId === "undefined") {
      console.error("Delete failed: ID is missing", user);
      return alert("Error: User ID is missing. Check console for details.");
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Authentication token is missing from localStorage");
      return alert("Error: You are not logged in. Please log in again.");
    }

    const url = `http://localhost:8080/api/users/${targetId}`;
    console.log(`Attempting DELETE request to: ${url} with token: ${token.substring(0, 10)}...`);

    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Server returned ${res.status}`);
      }

      setUsers((prev) => prev.filter((u) => (u.id || u._id) !== targetId));
    } catch (err: Error | unknown) {
      const message = err instanceof Error ? err.message : "An error occurred while deleting the user.";
      alert(message);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.name?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (u.email?.toLowerCase().includes(search.toLowerCase()) ?? false);
    
    // Case-insensitive role comparison
    const matchesRole = roleFilter === "All" || u.role?.toLowerCase() === roleFilter.toLowerCase();
    
    return matchesSearch && matchesRole;
  });

  return (
    <>
      <PageMeta title="Manage Users | Admin" description="System user management" />

      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Users</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            View and manage all system users and their roles
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-brand-400"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
        >
          <option value="All">All Roles</option>
          <option value="Teacher">Teacher</option>
          <option value="Student">Student</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">User</th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email</th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Role</th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {error ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-red-500">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-base font-medium">Error loading users</p>
                      <p className="text-xs">{error}</p>
                    </div>
                  </td>
                </tr>
              ) : isLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-base font-medium">No users found</p>
                      <p className="text-xs">Try adjusting your filters or search terms.</p>
                    </div>
                  </td>
                </tr>
              )}
              {filteredUsers.map((user) => (
                <tr key={user.id || user._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 flex items-center justify-center font-bold border border-brand-100 dark:border-brand-800">
                        {user.name?.charAt(0) || "?"}
                      </div>
                      <span className="font-semibold text-gray-800 dark:text-white">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{user.email}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${user.role === 'Teacher' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`flex items-center gap-1.5 text-xs font-semibold ${
                      user.status?.toLowerCase() === 'active' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        user.status?.toLowerCase() === 'active' ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                      {user.status || "Active"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-3 transition-opacity">
                      <button
                        onClick={() => navigate(`/admin/users/edit/${user.id || user._id}`)}
                        className="text-brand-500 hover:underline font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="text-red-500 hover:underline font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}