"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [search, setSearch] = useState("");
  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/announcements`);
        setAnnouncements(res.data);
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      }
    };
    fetchAnnouncements();
  }, [baseURL]);

  // 🔍 Filter announcements by search term
  const filtered = announcements.filter((a) => {
    const term = search.toLowerCase();
    return (
      a.title.toLowerCase().includes(term) ||
      a.department.toLowerCase().includes(term) ||
      (a.description && a.description.toLowerCase().includes(term))
    );
  });

  return (
    <section className="min-h-screen bg-white text-gray-900 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-blue-800 text-center">
          Announcements
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Stay updated with the latest news, placement drives, and training
          opportunities from the Placement Cell.
        </p>

        {/* 🔍 Search Bar */}
        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search announcements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* 📋 Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
          <table className="min-w-full table-auto">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Sl. No.
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Department
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Description
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Link
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No announcements found.
                  </td>
                </tr>
              ) : (
                filtered.map((a, index) => (
                  <tr
                    key={a._id}
                    className="border-b hover:bg-blue-50 transition"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {a.title}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {a.department}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(a.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 line-clamp-2">
                      {a.description || "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {a.link ? (
                        <a
                          href={a.link}
                          target="_blank"
                          className="text-blue-600 font-medium hover:underline"
                        >
                          Open
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
