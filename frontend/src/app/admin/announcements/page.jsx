"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AnnouncementsAdminPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "",
    date: "",
    link: "",
  });
  const [editingId, setEditingId] = useState(null);

  const baseURL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // ✅ Fetch all announcements
  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/announcements`);
      setAnnouncements(res.data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [baseURL]);

  // ✅ Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${baseURL}/api/announcements/${editingId}`, formData);
        toast.success("Announcement updated successfully!");
      } else {
        await axios.post(`${baseURL}/api/announcements`, formData);
        toast.success("Announcement added successfully!");
      }

      setFormData({
        title: "",
        description: "",
        department: "",
        date: "",
        link: "",
      });
      setEditingId(null);
      fetchAnnouncements();
    } catch (error) {
      console.error("Error saving announcement:", error);
      toast.error("Something went wrong!");
    }
  };

  // ✅ Edit
  const handleEdit = (a) => {
    setEditingId(a._id);
    setFormData({
      title: a.title,
      description: a.description || "",
      department: a.department || "",
      date: a.date.split("T")[0],
      link: a.link || "",
    });
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      try {
        await axios.delete(`${baseURL}/api/announcements/${id}`);
        toast.info("Announcement deleted.");
        fetchAnnouncements();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 text-gray-700">
      <h1 className="text-2xl font-bold mb-6 text-blue-700 text-center">
        {editingId ? "Edit Announcement" : "Add New Announcement"}
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-200 mb-10"
      >
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Department *</label>
          <input
            type="text"
            name="department"
            placeholder="e.g. Computer Science"
            value={formData.department}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Date *</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Link</label>
          <input
            type="url"
            name="link"
            placeholder="https://..."
            value={formData.link}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-col col-span-full">
          <label className="text-gray-700 font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          ></textarea>
        </div>

        <div className="col-span-full flex justify-center mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            {editingId ? "Update Announcement" : "Add Announcement"}
          </button>
        </div>
      </form>

      {/* Table View */}
      <h2 className="text-xl font-semibold mb-4">All Announcements</h2>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
        <table className="min-w-full table-auto">
          <thead className="bg-blue-700 text-white">
            <tr>
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
              <th className="px-4 py-3 text-center text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {announcements.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No announcements found.
                </td>
              </tr>
            ) : (
              announcements.map((a) => (
                <tr
                  key={a._id}
                  className="border-b hover:bg-blue-50 transition"
                >
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
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(a)}
                        className="bg-yellow-400 text-gray-900 px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(a._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
