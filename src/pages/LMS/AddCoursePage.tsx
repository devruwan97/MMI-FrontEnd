import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { API_BASE_URL, getAuthHeaders } from "../../api/Api";

export default function AddCoursePage() {
  const navigate = useNavigate();
  const userId = Number(localStorage.getItem("userId"));

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    fee: "",
    capacity: "",
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("You are not logged in. Please login first.");
      navigate("/signin");
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      category: form.category,
      fee: parseFloat(form.fee),
      capacity: parseInt(form.capacity),
    };

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/courses/user/${userId}`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      if (res.status === 403) {
        throw new Error("Unauthorized (403). Check your token or role.");
      }

      if (!res.ok) {
        throw new Error("Failed to create course");
      }

      alert("Course created successfully");
      navigate("/courses");

    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error creating course");
    }
  };

  return (
    <>
      <PageMeta title="Add Course" description="Create new course" />

      <div className="max-w-xl mx-auto mt-[10vh] bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Add New Course
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Create a new learning course for students
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            name="title"
            placeholder="Course title"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <textarea
            name="description"
            placeholder="Course description"
            onChange={handleChange}
            className="w-full px-4 py-3 h-28 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />

          <select
            name="category"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue=""
            required
          >
            <option value="" disabled>
              Select course type
            </option>

            <option value="Bachelor of Mathematics">
              Bachelor of Mathematics
            </option>

            <option value="Bachelor of Applied Mathematics">
              Bachelor of Applied Mathematics
            </option>

            <option value="Bachelor of Statistics">
              Bachelor of Statistics
            </option>

            <option value="Diploma in Mathematics">
              Diploma in Mathematics
            </option>

            <option value="Diploma in Data Science">
              Diploma in Data Science
            </option>

            <option value="Advanced Diploma in Mathematics">
              Advanced Diploma in Mathematics
            </option>

            <option value="Graduate Certificate in Mathematics">
              Graduate Certificate in Mathematics
            </option>

            <option value="Honours Mathematics Program">
              Honours Mathematics Program
            </option>

            <option value="Masters Preparatory Program">
              Masters Preparatory Program
            </option>
          </select>

          <div className="grid grid-cols-2 gap-4">

            <input
              name="fee"
              type="number"
              placeholder="Fee ($)"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              name="capacity"
              type="number"
              placeholder="Capacity"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
          >
            Create Course
          </button>

        </form>
      </div>
    </>
  );
}
