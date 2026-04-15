import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";

export default function AddCoursePage() {
  const navigate = useNavigate();

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

    const payload = {
      title: form.title,
      description: form.description,
      category: form.category,
      fee: parseFloat(form.fee),
      capacity: parseInt(form.capacity),
    };

    try {
      const res = await fetch(
        "http://localhost:8080/api/courses/user/1", // ⚠️ temporary
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to create course");
      }

      alert("Course created successfully");

      // ✅ redirect back
      navigate("/courses");

    } catch (err) {
      console.error(err);
      alert("Error creating course");
    }
  };

  return (
    <>
      <PageMeta title="Add Course" description="Create new course" />

      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Add New Course</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="title"
            placeholder="Title"
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            name="category"
            placeholder="Category"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            name="fee"
            type="number"
            placeholder="Fee"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            name="capacity"
            type="number"
            placeholder="Capacity"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create Course
          </button>
        </form>
      </div>
    </>
  );
}
