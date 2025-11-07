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
  function toTitleCase(str) {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  // Fetch all placed students
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

  // Apply filters
  useEffect(() => {
    let filteredData = students;

    if (filters.year)
      filteredData = filteredData.filter(
        (s) => s.yearOfPassing === Number(filters.year)
      );
    if (filters.branch)
      filteredData = filteredData.filter((s) =>
        s.branch.toLowerCase().includes(filters.branch.toLowerCase())
      );
    if (filters.company)
      filteredData = filteredData.filter((s) =>
        s.companyName.toLowerCase().includes(filters.company.toLowerCase())
      );
    if (filters.location)
      filteredData = filteredData.filter((s) =>
        s.location.toLowerCase().includes(filters.location.toLowerCase())
      );

    setFiltered(filteredData);
  }, [filters, students]);

  // Handle filter change
  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  if (loading)
    return <p className="text-center py-10 text-gray-500">Loading...</p>;

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 md:px-10">
      <h1 className="text-3xl md:text-4xl font-bold text-blue-900 text-center mb-10">
        Placed Students
      </h1>

      {/* Filters Section */}
      <div className="flex flex-wrap justify-center gap-4 mb-10 bg-white p-4 rounded-lg shadow-md">
        <select
          value={filters.year}
          onChange={(e) => handleChange("year", e.target.value)}
          className="border rounded-md px-3 py-2 text-gray-700"
        >
          <option value="">All Years</option>
          {[2026, 2027, 2028, 2029, 2030, 2031].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Filter by Department"
          value={filters.branch}
          onChange={(e) => handleChange("branch", e.target.value)}
          className="border rounded-md px-3 py-2 text-gray-700"
        />

        <input
          type="text"
          placeholder="Filter by Company"
          value={filters.company}
          onChange={(e) => handleChange("company", e.target.value)}
          className="border rounded-md px-3 py-2 text-gray-700"
        />

        <input
          type="text"
          placeholder="Filter by Location"
          value={filters.location}
          onChange={(e) => handleChange("location", e.target.value)}
          className="border rounded-md px-3 py-2 text-gray-700"
        />

        <button
          onClick={() =>
            setFilters({ year: "", branch: "", company: "", location: "" })
          }
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        >
          Clear
        </button>
      </div>

      {/* Results Count */}
      <div className="text-gray-600 text-center mb-6">
        Showing <strong>{filtered.length}</strong> placed{" "}
        {filtered.length === 1 ? "student" : "students"}
      </div>

      {/* Cards Grid */}
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
                className={`bg-gradient-to-br ${bgGradient} rounded-2xl shadow-lg p-6 flex flex-col items-center hover:-translate-y-1 hover:shadow-2xl transition-transform duration-300`}
              >
                {/* Photo */}
                <div className="relative mb-4">
                  <img
                    src={s.photoUrl}
                    alt={s.name}
                    className="w-36 h-36 object-cover rounded-full border-4 border-white shadow-md"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/150x150.png?text=No+Photo";
                    }}
                  />
                  <div className="absolute bottom-1 right-1 bg-white/90 text-[10px] text-gray-600 px-2 py-0.5 rounded-md shadow">
                    {s.yearOfPassing}
                  </div>
                </div>

                {/* Name */}
                <h2 className="text-xl font-bold text-gray-800 mb-1 text-center">
                  {toTitleCase(s.name)}
                </h2>
                <p className="text-sm text-gray-500 mb-2">
                  Reg No:{" "}
                  <span className="font-medium text-gray-700">
                    {s.registerNumber?.toUpperCase()}
                  </span>
                </p>

                {/* Branch */}
                <div className="text-sm text-gray-700 mb-2">
                  <strong>Branch:</strong>{" "}
                  <span className="text-blue-700 font-semibold">
                    {s.branch?.toUpperCase()}
                  </span>
                </div>

                {/* Company */}
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

                {/* Location */}
                <div className="mt-2 text-sm text-gray-700 flex items-center gap-1">
                  📍 {toTitleCase(s.location)}
                </div>

                {/* Package */}
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
