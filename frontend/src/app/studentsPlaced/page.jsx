"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function PlacedStudents() {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    year: "",
    branch: "",
    company: "",
    location: "",
  });
  const [loading, setLoading] = useState(true);

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/placed-students`;

  // ✅ Capitalize Words
  function toTitleCase(str) {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  // ✅ Fetch all students
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(API_URL);
        setStudents(res.data);
        setFiltered(res.data);
      } catch (error) {
        console.error("Error fetching placed students:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Apply filters
  useEffect(() => {
    let filteredData = students;

    if (filters.year)
      filteredData = filteredData.filter(
        (s) => String(s.yearOfPassing) === String(filters.year)
      );
    if (filters.branch)
      filteredData = filteredData.filter((s) =>
        s.branch?.toLowerCase().includes(filters.branch.toLowerCase())
      );
    if (filters.company)
      filteredData = filteredData.filter((s) =>
        s.companyName?.toLowerCase().includes(filters.company.toLowerCase())
      );
    if (filters.location)
      filteredData = filteredData.filter((s) =>
        s.location?.toLowerCase().includes(filters.location.toLowerCase())
      );

    setFiltered(filteredData);
  }, [filters, students]);

  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  if (loading)
    return <p className="text-center py-10 text-gray-500 text-lg">Loading...</p>;

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-sky-50 py-12 px-4 md:px-10">
      <h1 className="text-4xl font-extrabold text-center text-blue-900 mb-10 drop-shadow-sm">
        🌟 Placed Students
      </h1>

      {/* ✅ Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-10 bg-white/70 backdrop-blur-md p-4 rounded-xl shadow-lg border border-blue-100">
        <select
          value={filters.year}
          onChange={(e) => handleChange("year", e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
        >
          <option value="">All Years</option>
          {[2024, 2025, 2026, 2027, 2028].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Filter by Branch"
          value={filters.branch}
          onChange={(e) => handleChange("branch", e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <input
          type="text"
          placeholder="Filter by Company"
          value={filters.company}
          onChange={(e) => handleChange("company", e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <input
          type="text"
          placeholder="Filter by Location"
          value={filters.location}
          onChange={(e) => handleChange("location", e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <button
          onClick={() =>
            setFilters({ year: "", branch: "", company: "", location: "" })
          }
          className="bg-gray-600 text-white px-5 py-2 rounded-md hover:bg-gray-700 transition"
        >
          Clear
        </button>
      </div>

      {/* ✅ Results Info */}
      <p className="text-center text-gray-600 mb-6 text-sm">
        Showing{" "}
        <strong className="text-blue-700">{filtered.length}</strong>{" "}
        {filtered.length === 1 ? "student" : "students"}
      </p>

      {/* ✅ Students Grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          No students match your filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map((s, index) => {
            const gradients = [
              "from-indigo-100 to-blue-50",
              "from-pink-100 to-rose-50",
              "from-emerald-100 to-green-50",
              "from-amber-100 to-yellow-50",
              "from-sky-100 to-cyan-50",
              "from-purple-100 to-fuchsia-50",
            ];
            const bgGradient = gradients[index % gradients.length];

            return (
              <div
                key={s._id}
                className={`bg-gradient-to-br ${bgGradient} rounded-2xl shadow-lg p-6 flex flex-col items-center hover:-translate-y-2 hover:shadow-2xl transition-transform duration-300`}
              >
                {/* ✅ Photo */}
                <div className="relative mb-4">
                  <img
                    src={
                      s.image?.url ||
                      "https://via.placeholder.com/150x150.png?text=No+Photo"
                    }
                    alt={s.name}
                    className="w-36 h-36 object-cover rounded-full border-4 border-white shadow-md"
                  />
                  <div className="absolute bottom-1 right-1 bg-white/90 text-[10px] text-gray-600 px-2 py-0.5 rounded-md shadow">
                    {s.yearOfPassing}
                  </div>
                </div>

                {/* ✅ Name */}
                <h2 className="text-xl font-bold text-gray-800 mb-1 text-center">
                  {toTitleCase(s.name)}
                </h2>
                <p className="text-sm text-gray-500 mb-2">
                  Reg No:{" "}
                  <span className="font-medium text-gray-700">
                    {s.registerNumber?.toUpperCase()}
                  </span>
                </p>

                {/* ✅ Branch */}
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Branch:</strong>{" "}
                  <span className="text-blue-700 font-semibold">
                    {s.branch?.toUpperCase()}
                  </span>
                </p>

                {/* ✅ Company */}
                <div className="mt-2 text-center bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-gray-200">
                  <div className="text-sm font-semibold text-blue-800">
                    {toTitleCase(s.companyName)}
                  </div>
                  {s.designation && (
                    <div className="text-xs text-gray-600 italic">
                      {toTitleCase(s.designation)}
                    </div>
                  )}
                </div>

                {/* ✅ Location */}
                <div className="mt-2 text-sm text-gray-700 flex items-center gap-1">
                  📍 {toTitleCase(s.location)}
                </div>

                {/* ✅ Package */}
                <div className="mt-3 text-green-700 font-bold text-lg">
                  💰 {s.packageOffered} LPA
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
