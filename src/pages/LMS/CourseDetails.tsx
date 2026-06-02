import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { API_BASE_URL } from "../../api/Api";

function UnitCard({ unit }: any) {
  const [open, setOpen] = useState(false);
  const [materials, setMaterials] = useState<any[]>(unit.materials || []);
  const [file, setFile] = useState<File | null>(null);

  const getToken = () => localStorage.getItem("token");

  const uploadMaterial = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `${API_BASE_URL}/api/units/${unit.id}/materials`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      }
    );

    if (!res.ok) return;

    const data = await res.json();
    setMaterials((prev) => [...prev, data]);
    setFile(null);
  };

  const deleteMaterial = async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/api/materials/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!res.ok) return;

    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="border rounded-lg p-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between font-semibold"
      >
        <span>
          {unit.unitCode} - {unit.unitName}
        </span>
        <span>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-gray-500">
            {unit.description}
          </p>

          <div className="space-y-2">
            {materials.map((m: any) => (
              <div
                key={m.id}
                className="flex justify-between border p-2 rounded"
              >
                <a
                  href={m.url}
                  target="_blank"
                  className="text-blue-500"
                >
                  {m.title}
                </a>

                <button
                  onClick={() => deleteMaterial(m.id)}
                  className="text-red-500 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 items-center mt-3">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) =>
                setFile(e.target.files?.[0] || null)
              }
            />

            <button
              onClick={uploadMaterial}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Add Material
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState<any>(null);
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const isAdmin = userRole === "admin";

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/courses/${id}`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        const data = await res.json();
        setCourse(data);
      } catch {
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/courses/${id}/units`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        const data = await res.json();
        setUnits(data?.units || []);
      } catch {
        setUnits([]);
      }
    };

    fetchUnits();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Delete this course?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/courses/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (!res.ok) return;

      navigate("/courses");
    } catch {}
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading course...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-10 text-center">
        Course not found
        <Link to="/courses" className="block text-brand-500 mt-3">
          Back
        </Link>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title={`${course.title} | LMS`}
        description={course.description}
      />

      <Link
        to="/courses"
        className="text-sm text-brand-500 mb-3 inline-block"
      >
        ← Back to Courses
      </Link>

      <div className="rounded-2xl overflow-hidden border mb-6">
        <img
          src="https://info.ehl.edu/hubfs/Blog-EHL-Insights/Blog-Header-EHL-Insights/e_learning_course.jpg"
          className="h-56 w-full object-cover"
        />

        <div className="p-6 bg-white dark:bg-gray-900 flex justify-between">
          <div>
            <span className="text-xs text-brand-500 bg-brand-50 px-2 py-1 rounded">
              {course.category}
            </span>

            <h1 className="text-2xl font-bold mt-2">
              {course.title}
            </h1>

            <p className="text-gray-500 mt-2">
              {course.description}
            </p>
          </div>

          <div className="border p-4 rounded-xl min-w-[140px] text-center">
            <p className="text-3xl font-bold text-brand-600">
              ${course.fee}
            </p>

            <p className="text-xs text-gray-400">per term</p>

            <p className="text-xs mt-2 text-gray-400">
              Capacity: {course.capacity}
            </p>

            {isAdmin && (
              <div className="mt-3 space-y-2">
                <button
                  onClick={() =>
                    navigate(`/courses/edit/${course.id}`)
                  }
                  className="w-full bg-blue-500 text-white text-xs py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={handleDelete}
                  className="w-full bg-red-500 text-white text-xs py-1 rounded"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border p-6 bg-white dark:bg-gray-900 mb-6">
        <h2 className="text-lg font-semibold mb-4">
          Course Units
        </h2>

        <div className="space-y-4">
          {units.map((unit: any) => (
            <UnitCard key={unit.id} unit={unit} />
          ))}
        </div>
      </div>
    </>
  );
}