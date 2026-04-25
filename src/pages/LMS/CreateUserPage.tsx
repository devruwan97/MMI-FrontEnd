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
    phone: "",

    dateOfBirth: "",
    parentName: "",
    address: "",

    qualifications: "",
    bio: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const userRes = await fetch("http://localhost:8080/api/auth/register", {
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

      if (!userRes.ok) throw new Error("User creation failed");

      const userData = await userRes.json();
      const userId = userData.id;

      if (form.role === "student") {
        const studentRes = await fetch(
          "http://localhost:8080/api/students",
          {
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
          }
        );

        if (!studentRes.ok) {
          console.error("Student creation failed");
        }
      }

      if (form.role === "teacher") {
        const teacherRes = await fetch(
          `http://localhost:8080/api/teachers/user/${userId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify({
              qualifications: form.qualifications,
              bio: form.bio,
            }),
          }
        );

        if (!teacherRes.ok) {
          const err = await teacherRes.text();
          console.error("Teacher creation failed:", err);
        }
      }

      alert("User created successfully");

      navigate("/admin/manage-users");
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

          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <input
            name="passwordHash"
            type="password"
            placeholder="Password"
            value={form.passwordHash}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="student">student</option>
            <option value="teacher">teacher</option>
            <option value="admin">admin</option>
          </select>

          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          {form.role === "student" && (
            <>
              <input
                name="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />

              <input
                name="parentName"
                placeholder="Parent Name"
                value={form.parentName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />

              <textarea
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </>
          )}

          {form.role === "teacher" && (
            <>
              <textarea
                name="qualifications"
                placeholder="Qualifications"
                value={form.qualifications}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />

              <textarea
                name="bio"
                placeholder="Bio"
                value={form.bio}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </>
          )}

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
