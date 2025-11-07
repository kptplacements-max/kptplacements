"use client";

import { useEffect, useState } from "react";
import { getAllPlacementYears } from "./api";

export default function PlacementStatsPage() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    getAllPlacementYears().then((data) => setStats(data || []));
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 px-4 md:px-8">
      <h1 className="text-4xl font-bold text-blue-900 mb-10 text-center drop-shadow-sm">
        Placement Statistics
      </h1>

      {stats.map((yearData) => (
        <div
          key={yearData.year}
          className="mb-16 bg-white rounded-2xl shadow-md p-6 overflow-x-auto"
        >
          <h2 className="text-2xl font-semibold text-blue-700 mb-6 text-center">
            Passing Year {yearData.year}
          </h2>

          <table className="min-w-full text-sm border border-gray-300 rounded-lg shadow-md overflow-hidden">
            <thead className="sticky top-0 z-10">
              {/* --- Main Header Row --- */}
              <tr className="text-white text-sm">
                <th className="bg-blue-900 p-2 border text-center">Sl. No.</th>
                <th className="bg-blue-900 p-2 border text-center">Program</th>

                <th colSpan="3" className="bg-sky-700 p-2 border text-center">
                  Total Student Strength
                </th>

                <th colSpan="3" className="bg-pink-700 p-2 border text-center">
                  Total Students Passed
                </th>

                <th
                  colSpan="3"
                  className="bg-emerald-700 p-2 border text-center"
                >
                  Total Students Placed
                </th>

                <th
                  colSpan="3"
                  className="bg-indigo-700 p-2 border text-center"
                >
                  Opted for Higher Studies
                </th>

                <th colSpan="3" className="bg-red-700 p-2 border text-center">
                  Dropouts / Backlogs
                </th>

                <th colSpan="2" className="bg-amber-600 p-2 border text-center">
                  Entrepreneurs
                </th>

                <th
                  colSpan="3"
                  className="bg-purple-700 p-2 border text-center"
                >
                  % Placement
                </th>
              </tr>

              {/* --- Sub-header Row --- */}
              <tr className="bg-gray-100 text-gray-800 font-semibold text-xs uppercase tracking-wide">
                <th className="border p-1"></th>
                <th className="border p-1"></th>

                {[
                  // Total Student Strength (3)
                  "Male",
                  "Female",
                  "Total",
                  // Total Students Passed (3)
                  "Male",
                  "Female",
                  "Total",
                  // Total Students Placed (3)
                  "Male",
                  "Female",
                  "Total",
                  // Opted for Higher Studies (3)
                  "Male",
                  "Female",
                  "Total",
                  // Dropouts / Backlogs (3)
                  "Male",
                  "Female",
                  "Total",
                  // Entrepreneurs (2)
                  "Male",
                  "Female",
                  // % Placement (3)
                  "Male",
                  "Female",
                  "Total",
                ].map((h, idx) => (
                  <th key={idx} className="border p-1 bg-gray-50 text-gray-700">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {yearData.programs.map((p, i) => {
                // Safe numeric conversions
                const male = Number(p.male ?? 0);
                const female = Number(p.female ?? 0);
                const total = Number(p.total ?? male + female);

                const passedMale = Number(p.passedMale ?? 0);
                const passedFemale = Number(p.passedFemale ?? 0);
                const passedTotal = Number(
                  p.passedTotal ?? passedMale + passedFemale
                );

                const placedMale = Number(p.placedMale ?? 0);
                const placedFemale = Number(p.placedFemale ?? 0);
                const placedTotal = Number(
                  p.placedTotal ?? placedMale + placedFemale
                );

                const higherMale = Number(p.higherMale ?? 0);
                const higherFemale = Number(p.higherFemale ?? 0);
                const higherTotal = Number(
                  p.higherTotal ?? higherMale + higherFemale
                );

                const dropoutMale = Number(p.dropoutMale ?? 0);
                const dropoutFemale = Number(p.dropoutFemale ?? 0);
                const dropoutTotal = Number(
                  p.dropoutTotal ?? dropoutMale + dropoutFemale
                );

                const entrepreneurMale = Number(p.entrepreneurMale ?? 0);
                const entrepreneurFemale = Number(p.entrepreneurFemale ?? 0);

                const pctMale = Number(p.percentageMale ?? 0);
                const pctFemale = Number(p.percentageFemale ?? 0);
                const pctTotal = Number(
                  p.percentageTotal ?? (placedTotal / (total || 1)) * 100
                );

                return (
                  <tr
                    key={i}
                    className={`text-center text-gray-700 ${
                      i % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-50 transition`}
                  >
                    <td className="border p-2 font-medium">{i + 1}</td>
                    <td className="border p-2 font-semibold text-blue-700">
                      {p.program}
                    </td>

                    {/* 🩵 Total Student Strength */}
                    <td className="border p-2 bg-sky-100">{male}</td>
                    <td className="border p-2 bg-sky-100">{female}</td>
                    <td className="border p-2 bg-sky-100">{total}</td>

                    {/* 💚 Total Students Passed */}
                    <td className="border p-2 bg-pink-100">{passedMale}</td>
                    <td className="border p-2 bg-pink-100">{passedFemale}</td>
                    <td className="border p-2 bg-pink-100">{passedTotal}</td>

                    {/* 🟩 Total Students Placed */}
                    <td className="border p-2 bg-emerald-100">{placedMale}</td>
                    <td className="border p-2 bg-emerald-100">
                      {placedFemale}
                    </td>
                    <td className="border p-2 bg-emerald-100">{placedTotal}</td>

                    {/* 🟣 Opted for Higher Studies */}
                    <td className="border p-2 bg-indigo-100">{higherMale}</td>
                    <td className="border p-2 bg-indigo-100">{higherFemale}</td>
                    <td className="border p-2 bg-indigo-100">{higherTotal}</td>

                    {/* ❤️ Dropouts / Backlogs */}
                    <td className="border p-2 bg-red-100">{dropoutMale}</td>
                    <td className="border p-2 bg-red-100">{dropoutFemale}</td>
                    <td className="border p-2 bg-red-100">{dropoutTotal}</td>

                    {/* 🟠 Entrepreneurs */}
                    <td className="border p-2 bg-amber-100">
                      {entrepreneurMale}
                    </td>
                    <td className="border p-2 bg-amber-100">
                      {entrepreneurFemale}
                    </td>

                    {/* 💜 % Placement */}
                    <td className="border p-2 bg-purple-100 text-emerald-700 font-semibold">
                      {pctMale.toFixed(2)}
                    </td>
                    <td className="border p-2 bg-purple-100 text-emerald-700 font-semibold">
                      {pctFemale.toFixed(2)}
                    </td>
                    <td className="border p-2 bg-purple-100 text-emerald-700 font-semibold">
                      {pctTotal.toFixed(2)}
                    </td>
                  </tr>
                );
              })}

              {/* Totals Row */}
              <tr className="bg-blue-100 font-semibold text-gray-800">
                <td className="border p-2" colSpan="2">
                  Total
                </td>

                {/* Total Students */}
                <td className="border p-2 bg-sky-200" colSpan="3">
                  {yearData.totalStudents ?? 0}
                </td>

                {/* Total Passed */}
                <td className="border p-2 bg-pink-200" colSpan="3">
                  {yearData.totalPassed ?? 0}
                </td>

                {/* Total Placed */}
                <td className="border p-2 bg-emerald-200" colSpan="3">
                  {yearData.totalPlaced ?? 0}
                </td>

                {/* Higher Studies */}
                <td className="border p-2 bg-indigo-200" colSpan="3">
                  {yearData.totalHigherStudies ?? 0}
                </td>

                {/* Dropouts */}
                <td className="border p-2 bg-red-200" colSpan="3">
                  {yearData.totalDropouts ?? 0}
                </td>

                {/* Entrepreneurs */}
                <td className="border p-2 bg-amber-200" colSpan="2">
                  {yearData.totalEntrepreneurs ?? 0}
                </td>

                {/* Overall % */}
                <td className="border p-2 bg-purple-200" colSpan="3">
                  {(yearData.overallPercentage ?? 0).toFixed(2)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </main>
  );
}
