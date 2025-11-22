"use client";

import { useEffect, useState } from "react";
import axios from "axios";

/**
 * AnnouncementsPage
 * - Fixes table layout (colSpan)
 * - Adds loading state
 * - Adds responsive cards for small screens
 * - Adds "View" button + modal to read full description & details
 * - Uses a fallback baseURL when NEXT_PUBLIC_API_URL isn't set
 */

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null); // announcement selected for modal

  // fallback if env var is undefined
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${baseURL}/api/announcements`);
        setAnnouncements(res.data || []);
      } catch (err) {
        console.error("Failed to fetch announcements:", err);
        setError("Failed to load announcements. Check console for details.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, [baseURL]);

  // Filter announcements by search term
  const filtered = announcements.filter((a) => {
    const term = search.toLowerCase();
    return (
      (a.title || "").toLowerCase().includes(term) ||
      (a.department || "").toLowerCase().includes(term) ||
      ((a.description || "").toLowerCase().includes(term))
    );
  });

  // Helper for formatted date
  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return d;
    }
  };

  return (
    <section className="min-h-screen bg-white text-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-3 text-blue-800 text-center">
          Announcements
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Stay updated with the latest news, placement drives, and training
          opportunities from the Placement Cell.
        </p>

        {/* Search */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search announcements by title, department or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-2/3 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Loading / Error */}
        {loading ? (
          <div className="text-center py-10 text-gray-600">Loading announcements...</div>
        ) : error ? (
          <div className="text-center py-6 text-red-600">{error}</div>
        ) : null}

        {/* Table for md+ screens */}
        <div className="hidden md:block overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
          <table className="min-w-full table-auto">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Sl. No.</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Title</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Department</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  {/* FIXED: colspan matches number of columns (6) */}
                  <td colSpan="6" className="text-center py-6 text-gray-500 italic">
                    No announcements found.
                  </td>
                </tr>
              ) : (
                filtered.map((a, index) => (
                  <tr key={a._id} className="border-b hover:bg-blue-50 transition">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{index + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{a.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{a.department || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatDate(a.date)}</td>

                    {/* Short preview with clamp on desktop. Full visible via View modal */}
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div className="line-clamp-2">{a.description || "-"}</div>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelected(a)}
                          className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition"
                        >
                          View
                        </button>
                        {a.link ? (
                          <a
                            href={a.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Open Link
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Responsive cards for small screens */}
        <div className="md:hidden space-y-3">
          {filtered.length === 0 && !loading ? (
            <div className="text-center py-6 text-gray-500 italic">No announcements found.</div>
          ) : (
            filtered.map((a, idx) => (
              <div key={a._id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-lg">{a.title}</h3>
                    <p className="text-sm text-gray-500">
                      {a.department || "General"} • {formatDate(a.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <button
                      onClick={() => setSelected(a)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition"
                    >
                      View
                    </button>
                  </div>
                </div>

                {/* show short description on card */}
                <p className="mt-3 text-sm text-gray-700 line-clamp-3">{a.description || "-"}</p>

                {a.link && (
                  <div className="mt-3">
                    <a
                      href={a.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View attachment / link
                    </a>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal: full announcement viewer */}
      {selected && (
        <div
          aria-modal
          role="dialog"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelected(null)}
          />
          <div className="relative max-w-3xl w-full bg-white rounded-lg shadow-lg overflow-auto max-h-[90vh] z-10">
            <div className="flex items-start justify-between p-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold">{selected.title}</h2>
                <p className="text-sm text-gray-500">
                  {selected.department || "General"} • {formatDate(selected.date)}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-500 hover:text-gray-700 px-3 py-1"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-800 whitespace-pre-wrap">{selected.description || "-"}</p>

              {selected.link && (
                <div className="mt-4">
                  <a
                    href={selected.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    Open Link / Attachment
                  </a>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 text-right">
              <button
                onClick={() => setSelected(null)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
