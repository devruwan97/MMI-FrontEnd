import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageMeta from "../../../components/common/PageMeta";

interface Material {
  id: number;
  title: string;
  url: string;
}

interface Unit {
  id: number;
  unitCode: string;
  unitName: string;
  description: string;

  termId: number;
  termName: string;
  termStartDate: string;
  termEndDate: string;

  materials: Material[];
}

interface UnitResponse {
  unitCount: number;
  units: Unit[];
}

interface TermGroup {
  termId: number;
  termName: string;
  termStartDate: string;
  termEndDate: string;
  units: Unit[];
}

export default function MyUnitsPage() {
  const { courseId } = useParams();

  const [data, setData] = useState<UnitResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openTerm, setOpenTerm] = useState<number | null>(null);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:8080/api/courses/${courseId}/units`,
          {
            headers: {
              ...(token && {
                Authorization: `Bearer ${token}`,
              }),
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Server error (${res.status})`);
        }

        const result = await res.json();
        setData(result);
      } catch (err: any) {
        setError(err.message || "Failed to load units");
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, [courseId]);

  const toggleTerm = (termId: number) => {
    setOpenTerm(openTerm === termId ? null : termId);
  };

  // GROUP + SORT TERMS BY START DATE
  const groupByTerm = (units: Unit[]): TermGroup[] => {
    const grouped = units.reduce((acc: Record<number, TermGroup>, unit) => {
      if (!acc[unit.termId]) {
        acc[unit.termId] = {
          termId: unit.termId,
          termName: unit.termName,
          termStartDate: unit.termStartDate,
          termEndDate: unit.termEndDate,
          units: [],
        };
      }

      acc[unit.termId].units.push(unit);
      return acc;
    }, {});

    return Object.values(grouped).sort(
      (a, b) =>
        new Date(a.termStartDate).getTime() -
        new Date(b.termStartDate).getTime()
    );
  };

  const groupedTerms = data?.units ? groupByTerm(data.units) : [];

  return (
    <>
      <PageMeta title="My Units" description="Course learning materials" />

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          My Units
        </h1>

        {data && (
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {data.unitCount} Units Available
          </p>
        )}
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-500">Loading units...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center dark:border-red-900/30 dark:bg-red-900/20">
          <p className="text-red-600 dark:text-red-400 font-medium">
            {error}
          </p>
        </div>
      ) : groupedTerms.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-16 text-center">
          <div className="mb-4 text-4xl">📘</div>
          <p className="text-gray-500 dark:text-gray-400">
            No units available
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedTerms.map((term) => (
            <div
              key={term.termId}
              className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden"
            >
              {/* TERM HEADER */}
              <button
                onClick={() => toggleTerm(term.termId)}
                className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {term.termName}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(term.termStartDate).toLocaleDateString()} →{" "}
                    {new Date(term.termEndDate).toLocaleDateString()}
                  </p>
                </div>

                <span className="text-xl">
                  {openTerm === term.termId ? "−" : "+"}
                </span>
              </button>

              {/* UNITS */}
              {openTerm === term.termId && (
                <div className="p-5 border-t border-gray-100 dark:border-gray-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {term.units.map((unit) => (
                    <Link
                      key={unit.id}
                      to={`/courses/${courseId}/units/${unit.id}`}
                      state={{ unit }}
                      className="group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:shadow-lg transition-all"
                    >
                      {/* CARD HEADER */}
                      <div className="h-32 bg-gradient-to-r from-brand-500 to-brand-700 flex items-center justify-center text-white text-2xl font-bold">
                        {unit.unitCode}
                      </div>

                      {/* CARD BODY */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 dark:text-white group-hover:text-brand-500">
                          {unit.unitName}
                        </h3>

                        <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                          {unit.description}
                        </p>

                        <div className="mt-3 text-xs font-semibold text-brand-500">
                          Open Unit →
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}