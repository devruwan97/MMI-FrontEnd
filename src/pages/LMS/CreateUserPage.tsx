import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api/Api";

export default function CreateUserPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    passwordHash: "",
    role: "student",
    phone: "",
    dateOfBirth: "",
    parentName: "",
    address: "",
    qualifications: "",
    bio: "",
  });

  const [loading, setLoading] = useState(false);
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const userRes = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          passwordHash: form.passwordHash,
          role: form.role,
          phone: form.phone,
        }),
      });

      if (!userRes.ok) throw new Error();

      const userData = await userRes.json();
      const userId = userData.id;

      if (form.role === "student") {
        await fetch(`${API_BASE_URL}/api/students`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({
            userId,
            dateOfBirth: form.dateOfBirth,
            parentName: form.parentName,
            address: form.address,
          }),
        });
      }

      if (form.role === "teacher") {
        await fetch(`${API_BASE_URL}/api/teachers/user/${userId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({
            qualifications: form.qualifications,
            bio: form.bio,
          }),
        });
      }

      alert("User created successfully");
      navigate("/admin/manage-users");
    } catch {
      alert("Error creating user");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkFile) return;

    setBulkLoading(true);

    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();
      formData.append("file", bulkFile);

      const res = await fetch(`${API_BASE_URL}/api/users/bulk`, {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!res.ok) throw new Error();

      alert("Bulk users created successfully!");
      setBulkFile(null);
    } catch {
      alert("Bulk upload failed");
    } finally {
      setBulkLoading(false);
    }
  };

  return (
    <>
      <PageMeta title="Create User | Admin" description="Create new user" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4 flex justify-center">

        <div className="w-full max-w-3xl space-y-6">

          {/* BULK UPLOAD CARD */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
              Bulk Import Users
            </h2>

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">

              <input
                type="file"
                accept=".xlsx"
                onChange={(e) =>
                  setBulkFile(e.target.files?.[0] || null)
                }
                className="text-sm"
              />

              <button
                type="button"
                onClick={handleBulkUpload}
                disabled={!bulkFile || bulkLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                {bulkLoading ? "Uploading..." : "Upload Excel"}
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-3">
              Required columns: name, email, password, role, phone
            </p>
          </div>

          {/* MAIN FORM CARD */}
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl">

            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Create New User
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <input
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  className="input"
                />

                <input
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  className="input"
                />

              </div>

              <input
                name="passwordHash"
                type="password"
                placeholder="Password"
                value={form.passwordHash}
                onChange={handleChange}
                className="input"
              />

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="input"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
                <option value="management">Management</option>
              </select>

              <input
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="input"
              />

              {/* STUDENT */}
              {form.role === "student" && (
                <div className="space-y-3 p-4 rounded-xl bg-blue-50 dark:bg-gray-800 border">
                  <p className="text-sm font-semibold text-blue-600">
                    Student Details
                  </p>

                  <input
                    name="dateOfBirth"
                    type="date"
                    value={form.dateOfBirth}
                    onChange={handleChange}
                    className="input"
                  />

                  <input
                    name="parentName"
                    placeholder="Parent Name"
                    value={form.parentName}
                    onChange={handleChange}
                    className="input"
                  />

                  <textarea
                    name="address"
                    placeholder="Address"
                    value={form.address}
                    onChange={handleChange}
                    className="input h-24 resize-none"
                  />
                </div>
              )}

              {/* TEACHER */}
              {form.role === "teacher" && (
                <div className="space-y-3 p-4 rounded-xl bg-green-50 dark:bg-gray-800 border">
                  <p className="text-sm font-semibold text-green-600">
                    Teacher Details
                  </p>

                  <textarea
                    name="qualifications"
                    placeholder="Qualifications"
                    value={form.qualifications}
                    onChange={handleChange}
                    className="input h-24 resize-none"
                  />

                  <textarea
                    name="bio"
                    placeholder="Bio"
                    value={form.bio}
                    onChange={handleChange}
                    className="input h-24 resize-none"
                  />
                </div>
              )}

              <button
                disabled={loading}
                className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3 rounded-xl transition shadow-md"
              >
                {loading ? "Creating..." : "Create User"}
              </button>

            </form>
          </div>

        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          background: #f9fafb;
          outline: none;
          transition: 0.2s;
        }

        .dark .input {
          background: #1f2937;
          border-color: #374151;
          color: white;
        }

        .input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59,130,246,0.2);
        }
      `}</style>
    </>
  );
}