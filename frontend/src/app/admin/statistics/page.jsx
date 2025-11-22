"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function PlacementStatisticsManager() {
  const [data, setData] = useState(null);
  const [year, setYear] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL;
  const programs = ["AT", "CE", "CH", "CS", "EC", "EE", "ME", "PO"];

  useEffect(() => {
    if (year.length === 4) fetchData();
  }, [year]);

  const fetchData = async () => {
    if (!year) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/placements/${year}`);
      setData(res.data);
      setIsNew(false);
      toast.success(`Loaded data for ${year}`);
    } catch {
      toast.info("No data found — creating new data");
      setIsNew(true);
      createNewYear();
    }
    setLoading(false);
  };

  const createNewYear = () => {
    setData({
      year: Number(year),
      isPublic: false, // MANDATORY NEW FIELD
      programs: programs.map((p) => ({
        program: p,
        male: 0, female: 0, total: 0,
        passedMale: 0, passedFemale: 0, passedTotal: 0,
        placedMale: 0, placedFemale: 0, placedTotal: 0,
        higherMale: 0, higherFemale: 0, higherTotal: 0,
        dropoutMale: 0, dropoutFemale: 0, dropoutTotal: 0,
        entrepreneurMale: 0, entrepreneurFemale: 0,
        percentageMale: 0, percentageFemale: 0, percentageTotal: 0,
      })),
      totalStudents: 0,
      totalPassed: 0,
      totalPlaced: 0,
      totalHigherStudies: 0,
      totalDropouts: 0,
      totalEntrepreneurs: 0,
      overallPercentage: 0,
    });
  };

  const handleChange = (i, field, value) => {
    const updated = { ...data };
    updated.programs[i][field] = Number(value) || 0;
    setData(updated);
  };

  const handleSave = async () => {
    if (!year) return toast.error("Enter valid year!");

    try {
      if (isNew) {
        await axios.post(`${API}/api/placements`, data);
        toast.success("New year statistics added!");
      } else {
        await axios.put(`${API}/api/placements/${year}`, data);
        toast.success("Statistics updated successfully!");
      }
      setEditing(false);
      setIsNew(false);
    } catch {
      toast.error("Failed to save data");
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-md">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-blue-700">
          Placement Statistics - {year || "Select Year"}
        </h1>

        {/* YEAR INPUT */}
        <input
          type="text"
          placeholder="Enter Year (Ex: 2025)"
          value={year}
          maxLength={4}
          onChange={(e) => setYear(e.target.value.replace(/[^0-9]/g, ""))}
          className="border px-3 py-1.5 rounded-md w-40 text-gray-700"
        />

        {/* PUBLIC VISIBILITY TOGGLE */}
        {data && (
          <div className="flex items-center gap-2">
            <label className="font-medium text-gray-700">
              Visible on Public Website:
            </label>
            <input
              type="checkbox"
              checked={data?.isPublic || false}
              disabled={!editing}
              onChange={(e) =>
                setData((p) => ({ ...p, isPublic: e.target.checked }))
              }
              className="w-5 h-5 accent-blue-600 cursor-pointer"
            />
          </div>
        )}

        {/* ACTION BUTTON */}
        {data && (
          editing ? (
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
          )
        )}
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : data ? (
        <>
          {/* TABLE */}
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
                    "M","F","T",
                    "M","F","T",
                    "M","F","T",
                    "M","F","T",
                    "M","F","T",
                    "M","F",
                    "%","%","%",
                  ].map((h, idx) => (
                    <th key={idx} className="border p-1 bg-gray-50 text-gray-700">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {data.programs.map((p, i) => (
                  <tr key={i} className={`text-center ${i % 2 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50`}>
                    <td className="border p-1">{i + 1}</td>
                    <td className="border p-1 font-semibold text-blue-700">{p.program}</td>

                    {Object.keys(p).filter(k => k !== "program").map(field => (
                      <td key={field} className="border p-1">
                        {editing ? (
                          <input
                            type="number"
                            value={p[field]}
                            onChange={(e) => handleChange(i, field, e.target.value)}
                            className="w-14 border rounded text-center"
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

          {/* TOTALS */}
          <div className="mt-6 border-t pt-4 text-gray-700 text-sm grid grid-cols-1 md:grid-cols-3 gap-2">
            <p><strong>Total Students:</strong> {data.totalStudents}</p>
            <p><strong>Total Passed:</strong> {data.totalPassed}</p>
            <p><strong>Total Placed:</strong> {data.totalPlaced}</p>
            <p><strong>Total Higher Studies:</strong> {data.totalHigherStudies}</p>
            <p><strong>Total Dropouts:</strong> {data.totalDropouts}</p>
            <p><strong>Total Entrepreneurs:</strong> {data.totalEntrepreneurs}</p>

            <p className="col-span-full text-blue-700">
              <strong>Overall %:</strong> {data.overallPercentage}%
            </p>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">Enter year to load data</p>
      )}
    </div>
  );
}
