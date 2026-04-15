import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    fee: "",
    capacity: "",
  });

  useEffect(() => {
    fetch(`http://localhost:8080/api/courses/${id}`)
      .then((res) => res.json())
      .then((data) => setForm(data));
  }, [id]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await fetch(`http://localhost:8080/api/courses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    alert("Course updated successfully");
    navigate(`/courses/${id}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl">
      <h1 className="text-xl font-bold mb-4">Edit Course</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-2 border rounded"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded"
        />

        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full p-2 border rounded"
        />

        <input
          name="fee"
          value={form.fee}
          onChange={handleChange}
          placeholder="Fee"
          className="w-full p-2 border rounded"
        />

        <input
          name="capacity"
          value={form.capacity}
          onChange={handleChange}
          placeholder="Capacity"
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="bg-brand-500 text-white px-4 py-2 rounded"
        >
          Update Course
        </button>
      </form>
    </div>
  );
}
