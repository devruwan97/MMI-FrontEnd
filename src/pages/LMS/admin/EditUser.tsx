import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageMeta from "../../../components/common/PageMeta";

export default function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
  });

  useEffect(() => {
    if (!id || id === "undefined") {
      setError("Invalid User ID provided in URL");
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found in localStorage for user detail fetch");
    }

    const url = `http://localhost:8080/api/users/${id}`;
    console.log(`Fetching user details from: ${url} (Token present: ${!!token})`);

    fetch(url, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody.message || `Server Error (${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        // Map data checking for wrapped objects (e.g. data.user)
        const userData = data.user || data;
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          role: userData.role || "Student",
          status: userData.status || "Active",
        });
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:8080/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(formData),
      });
      
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to update user");
      
      alert("User updated successfully!");
      navigate("/admin/manage-users");
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center text-gray-500">Loading user details...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Error: {error}</div>;

  return (
    <>
      <PageMeta title="Edit User | Admin" description="Modify user details" />

      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Edit User</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Update information for user #{id}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                  <option value="Admin">Admin</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Student">Student</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button type="submit" disabled={isSaving} className="flex-1 bg-brand-500 text-white py-2.5 rounded-xl font-semibold hover:bg-brand-600 disabled:opacity-50 transition-colors">{isSaving ? "Saving..." : "Save Changes"}</button>
              <button type="button" onClick={() => navigate("/admin/manage-users")} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}