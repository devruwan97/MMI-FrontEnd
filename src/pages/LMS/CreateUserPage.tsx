import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useNavigate } from "react-router-dom";

export default function CreateUserPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    passwordHash: "",
    role: "student",
    phone: ""
  });

  const [loading, setLoading] = useState(false);

  // ✅ FIXED: safe state update (no stale state issue)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // IMPORTANT FIX
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Failed to create user");
      }

      alert("User created successfully");
      navigate("/createUser");
    } catch (err) {
      console.error(err);
      alert("Error creating user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta title="Create User | Admin" description="Create new user" />

      <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold mb-4">Create New User</h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <input
            name="name"
            placeholder="Name"
            className="w-full p-2 border rounded"
            value={form.name}
            onChange={handleChange}
          />

          {/* Email */}
          <input
            name="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            value={form.email}
            onChange={handleChange}
          />

          {/* Password */}
          <input
            name="passwordHash"
            placeholder="Password"
            type="password"
            className="w-full p-2 border rounded"
            value={form.passwordHash}
            onChange={handleChange}
          />

          {/* Role */}
          <select
            name="role"
            className="w-full p-2 border rounded"
            value={form.role}
            onChange={handleChange}
          >
            <option value="student">student</option>
            <option value="teacher">teacher</option>
            <option value="admin">admin</option>
          </select>

          <input
            name="phone"
            placeholder="Phone"
            className="w-full p-2 border rounded"
            value={form.phone}
            onChange={handleChange}
          />

          {/* Submit */}
          <button
            disabled={loading}
            className="w-full bg-brand-500 text-white p-2 rounded"
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>
    </>
  );
}
