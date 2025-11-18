"use client";

import { useEffect, useState } from "react";
import { getAllPlacementYears } from "./api";

export default function PlacementStatsPage() {
  const [stats, setStats] = useState([]);
useEffect(() => {
  getAllPlacementYears().then((data) => {
    if (!data || !Array.isArray(data)) {
      setStats([]);
      return;
    }

    // AUTO FILTER YEARS < 2026
    const filtered = data.filter((item) => Number(item.year) < 2026);

    // AUTO SORT LATEST FIRST
    const sorted = filtered.sort((a, b) => b.year - a.year);

    setStats(sorted);
  });
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
              {/* --- HEADER ROW --- */}
              <tr className="text-white text-sm">
                <th className="bg-blue-900 p-2 border text-center">Sl. No.</th>
                <th className="bg-blue-900 p-2 border text-center">Program</th>

                <th colSpan="3" className="bg-sky-700 p-2 border text-center">
                  Total Student Strength
                </th>

                <th colSpan="3" className="bg-pink-700 p-2 border text-center">
                  Total Students Passed
                </th>

                <th colSpan="3" className="bg-emerald-700 p-2 border text-center">
                  Total Students Placed
                </th>

                <th colSpan="3" className="bg-indigo-700 p-2 border text-center">
                  Opted for Higher Studies
                </th>

                <th colSpan="3" className="bg-red-700 p-2 border text-center">
                  Dropouts / Backlogs
                </th>

                <th colSpan="2" className="bg-amber-600 p-2 border text-center">
                  Entrepreneurs
                </th>

                <th colSpan="3" className="bg-purple-700 p-2 border text-center">
                  % Placement
                </th>
              </tr>

              {/* --- SUB HEADER --- */}
              <tr className="bg-gray-100 text-gray-800 font-semibold text-xs uppercase tracking-wide">
                <th className="border p-1"></th>
                <th className="border p-1"></th>

                {[
                  "Male", "Female", "Total",
                  "Male", "Female", "Total",
                  "Male", "Female", "Total",
                  "Male", "Female", "Total",
                  "Male", "Female", "Total",
                  "Male", "Female",
                  "Male", "Female", "Total"
                ].map((h, idx) => (
                  <th key={idx} className="border p-1 bg-gray-50 text-gray-700">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {yearData.programs.map((p, i) => {
                const getNum = (val) => Number(val ?? 0);

                const male = getNum(p.male);
                const female = getNum(p.female);
                const total = getNum(p.total || male + female);

                const passedMale = getNum(p.passedMale);
                const passedFemale = getNum(p.passedFemale);
                const passedTotal = getNum(p.passedTotal);

                const placedMale = getNum(p.placedMale);
                const placedFemale = getNum(p.placedFemale);
                const placedTotal = getNum(p.placedTotal);

                const higherMale = getNum(p.higherMale);
                const higherFemale = getNum(p.higherFemale);
                const higherTotal = getNum(p.higherTotal);

                const dropoutMale = getNum(p.dropoutMale);
                const dropoutFemale = getNum(p.dropoutFemale);
                const dropoutTotal = getNum(p.dropoutTotal);

                const entrepreneurMale = getNum(p.entrepreneurMale);
                const entrepreneurFemale = getNum(p.entrepreneurFemale);

                const pctMale = Number(getNum(p.percentageMale).toFixed(2));
                const pctFemale = Number(getNum(p.percentageFemale).toFixed(2));
                const pctTotal = Number(getNum(p.percentageTotal).toFixed(2));

                return (
                  <tr
                    key={i}
                    className={`text-center ${
                      i % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-50`}
                  >
                    <td className="border p-2">{i + 1}</td>
                    <td className="border p-2 font-semibold text-blue-700">
                      {p.program}
                    </td>

                    {/* Strength */}
                    <td className="border p-2 bg-sky-100">{male}</td>
                    <td className="border p-2 bg-sky-100">{female}</td>
                    <td className="border p-2 bg-sky-100">{total}</td>

                    {/* Passed */}
                    <td className="border p-2 bg-pink-100">{passedMale}</td>
                    <td className="border p-2 bg-pink-100">{passedFemale}</td>
                    <td className="border p-2 bg-pink-100">{passedTotal}</td>

                    {/* Placed */}
                    <td className="border p-2 bg-emerald-100">{placedMale}</td>
                    <td className="border p-2 bg-emerald-100">{placedFemale}</td>
                    <td className="border p-2 bg-emerald-100">{placedTotal}</td>

                    {/* Higher Studies */}
                    <td className="border p-2 bg-indigo-100">{higherMale}</td>
                    <td className="border p-2 bg-indigo-100">{higherFemale}</td>
                    <td className="border p-2 bg-indigo-100">{higherTotal}</td>

                    {/* Dropout */}
                    <td className="border p-2 bg-red-100">{dropoutMale}</td>
                    <td className="border p-2 bg-red-100">{dropoutFemale}</td>
                    <td className="border p-2 bg-red-100">{dropoutTotal}</td>

                    {/* Entrepreneurs */}
                    <td className="border p-2 bg-amber-100">{entrepreneurMale}</td>
                    <td className="border p-2 bg-amber-100">{entrepreneurFemale}</td>

                    {/* % Placement */}
                    <td className="border p-2 bg-purple-100">{pctMale}%</td>
                    <td className="border p-2 bg-purple-100">{pctFemale}%</td>
                    <td className="border p-2 bg-purple-100">{pctTotal}%</td>
                  </tr>
                );
              })}

              {/* TOTAL ROW */}
              <tr className="bg-blue-100 font-semibold text-gray-800">
                <td className="border p-2" colSpan="2">Total</td>

                <td className="border p-2 bg-sky-200" colSpan="3">
                  {yearData.totalStudents ?? 0}
                </td>

                <td className="border p-2 bg-pink-200" colSpan="3">
                  {yearData.totalPassed ?? 0}
                </td>

                <td className="border p-2 bg-emerald-200" colSpan="3">
                  {yearData.totalPlaced ?? 0}
                </td>

                <td className="border p-2 bg-indigo-200" colSpan="3">
                  {yearData.totalHigherStudies ?? 0}
                </td>

                <td className="border p-2 bg-red-200" colSpan="3">
                  {yearData.totalDropouts ?? 0}
                </td>

                <td className="border p-2 bg-amber-200" colSpan="2">
                  {yearData.totalEntrepreneurs ?? 0}
                </td>

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
