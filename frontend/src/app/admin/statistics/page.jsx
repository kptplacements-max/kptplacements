"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function PlacementStatisticsManager() {
  const [data, setData] = useState(null);
  const [year, setYear] = useState(2025);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isNew, setIsNew] = useState(false);

  // Fetch placement data for selected year
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/placements/${year}`
        );
        setData(res.data);
        setIsNew(false);
      } catch (error) {
        console.warn("No data found for this year. Creating new template...");
        setIsNew(true);
        setData({
          year: year,
          programs: ["AT", "CE", "CH", "CS", "EC", "EE", "ME", "PO"].map(
            (program) => ({
              program,
              male: 0,
              female: 0,
              total: 0,
              passedMale: 0,
              passedFemale: 0,
              passedTotal: 0,
              placedMale: 0,
              placedFemale: 0,
              placedTotal: 0,
              higherMale: 0,
              higherFemale: 0,
              higherTotal: 0,
              dropoutMale: 0,
              dropoutFemale: 0,
              dropoutTotal: 0,
              entrepreneurMale: 0,
              entrepreneurFemale: 0,
              percentageMale: 0,
              percentageFemale: 0,
              percentageTotal: 0,
            })
          ),
          totalStudents: 0,
          totalPassed: 0,
          totalPlaced: 0,
          totalHigherStudies: 0,
          totalDropouts: 0,
          totalEntrepreneurs: 0,
          overallPercentage: 0,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [year]);

  const handleChange = (i, field, value) => {
    const updated = { ...data };
    updated.programs[i][field] = Number(value) || 0;
    setData(updated);
  };

  const handleSave = async () => {
    try {
      if (isNew) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/placements`,
          data
        );
        toast.success(`Year ${year} added successfully!`);
      } else {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/placements/${year}`,
          data
        );
        toast.success("Updated successfully!");
      }
      setEditing(false);
      setIsNew(false);
    } catch (err) {
      console.error(err);
      toast.error("Save failed.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No data to display.</div>;

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-md">
      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-blue-700">
          Placement Statistics - {year}
        </h1>
        <div className="flex items-center gap-3">
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))} // 👈 FIXED: convert to Number
            className="border rounded-md px-3 py-1 text-gray-700"
          >
            {[
              2034, 2033, 2032, 2031, 2030, 2029, 2028, 2027, 2026, 2025, 2024,
              2023, 2022, 2021,
            ].map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>

          {editing ? (
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-1.5 rounded-md hover:bg-green-700"
            >
              {isNew ? "Add Year" : "Save"}
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-700 text-white px-4 py-1.5 rounded-md hover:bg-blue-800"
            >
              {isNew ? "Add New Data" : "Edit"}
            </button>
          )}
        </div>
      </div>

      {/* Responsive Scroll Container */}
      <div className="overflow-x-auto max-w-full border rounded-lg shadow-inner">
        <table className="min-w-full border text-xs md:text-sm">
          <thead className="text-white text-center sticky top-0 z-10">
            <tr>
              <th className="bg-blue-900 px-2 py-2 border">Sl. No</th>
              <th className="bg-blue-900 px-2 py-2 border">Program</th>
              <th colSpan="3" className="bg-sky-700 px-2 py-2 border">
                Total Strength
              </th>
              <th colSpan="3" className="bg-green-700 px-2 py-2 border">
                Passed
              </th>
              <th colSpan="3" className="bg-pink-700 px-2 py-2 border">
                Placed
              </th>
              <th colSpan="3" className="bg-indigo-700 px-2 py-2 border">
                Higher Studies
              </th>
              <th colSpan="3" className="bg-red-700 px-2 py-2 border">
                Dropouts
              </th>
              <th colSpan="2" className="bg-amber-600 px-2 py-2 border">
                Entrepreneurs
              </th>
              <th colSpan="3" className="bg-purple-700 px-2 py-2 border">
                %
              </th>
            </tr>
            <tr className="bg-gray-100 text-gray-800 font-semibold uppercase text-[10px] md:text-xs">
              <th className="border p-1"></th>
              <th className="border p-1"></th>
              {[
                "M",
                "F",
                "T",
                "M",
                "F",
                "T",
                "M",
                "F",
                "T",
                "M",
                "F",
                "T",
                "M",
                "F",
                "T",
                "M",
                "F",
                "%",
                "%",
                "%",
              ].map((h, idx) => (
                <th key={idx} className="border p-1 bg-gray-50 text-gray-700">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.programs.map((p, i) => (
              <tr
                key={i}
                className={`text-center text-gray-500 ${
                  i % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-blue-50 transition`}
              >
                <td className="border px-2 py-1 font-medium">{i + 1}</td>
                <td className="border px-2 py-1 font-semibold text-blue-700">
                  {p.program}
                </td>

                {/* Color-banded columns */}
                {[
                  { field: "male", color: "bg-sky-100" },
                  { field: "female", color: "bg-sky-100" },
                  { field: "total", color: "bg-sky-100" },
                  { field: "passedMale", color: "bg-green-100" },
                  { field: "passedFemale", color: "bg-green-100" },
                  { field: "passedTotal", color: "bg-green-100" },
                  { field: "placedMale", color: "bg-pink-100" },
                  { field: "placedFemale", color: "bg-pink-100" },
                  { field: "placedTotal", color: "bg-pink-100" },
                  { field: "higherMale", color: "bg-indigo-100" },
                  { field: "higherFemale", color: "bg-indigo-100" },
                  { field: "higherTotal", color: "bg-indigo-100" },
                  { field: "dropoutMale", color: "bg-red-100" },
                  { field: "dropoutFemale", color: "bg-red-100" },
                  { field: "dropoutTotal", color: "bg-red-100" },
                  { field: "entrepreneurMale", color: "bg-amber-100" },
                  { field: "entrepreneurFemale", color: "bg-amber-100" },
                  { field: "percentageMale", color: "bg-purple-100" },
                  { field: "percentageFemale", color: "bg-purple-100" },
                  { field: "percentageTotal", color: "bg-purple-100" },
                ].map(({ field, color }) => (
                  <td key={field} className={`border px-2 py-1 ${color}`}>
                    {editing ? (
                      <input
                        type="number"
                        value={p[field] ?? ""}
                        onChange={(e) => handleChange(i, field, e.target.value)}
                        className="w-16 border rounded text-center"
                      />
                    ) : (
                      p[field]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals Section */}
      <div className="mt-6 border-t pt-4 text-gray-700 text-sm grid grid-cols-1 md:grid-cols-3 gap-2">
        <p>
          <strong>Total Students:</strong> {data.totalStudents}
        </p>
        <p>
          <strong>Total Passed:</strong> {data.totalPassed}
        </p>
        <p>
          <strong>Total Placed:</strong> {data.totalPlaced}
        </p>
        <p>
          <strong>Total Higher Studies:</strong> {data.totalHigherStudies}
        </p>
        <p>
          <strong>Total Dropouts:</strong> {data.totalDropouts}
        </p>
        <p>
          <strong>Total Entrepreneurs:</strong> {data.totalEntrepreneurs}
        </p>
        <p className="col-span-full text-blue-700">
          <strong>Overall %:</strong> {data.overallPercentage?.toFixed(2)}%
        </p>
      </div>
    </div>
  );
}
