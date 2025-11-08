"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    category: "Other",
    description: "",
    eventDate: "",
    conductedBy: "",
    targetAudience: "",
    image: null,
  });
  const [editingId, setEditingId] = useState(null);

  // ✅ Use correct backend API base URL
  const baseURL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // ✅ Fetch all events
  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/events`);
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [baseURL]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key]);
    });

    try {
      if (editingId) {
        await axios.put(`${baseURL}/api/events/${editingId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Event updated!");
      } else {
        await axios.post(`${baseURL}/api/events`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Event created!");
      }

      // reset form
      setFormData({
        title: "",
        category: "Other",
        description: "",
        eventDate: "",
        conductedBy: "",
        targetAudience: "",
        image: null,
      });
      setEditingId(null);
      fetchEvents();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Something went wrong while saving the event!");
    }
  };

  // Delete event
  const handleDelete = async (id) => {
    if (confirm("Delete this event?")) {
      try {
        await axios.delete(`${baseURL}/api/events/${id}`);
        toast.info("Event deleted.");
        fetchEvents();
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Load event into form for edit
  const handleEdit = (event) => {
    setEditingId(event._id);
    setFormData({
      title: event.title,
      category: event.category,
      description: event.description,
      eventDate: event.eventDate.split("T")[0],
      conductedBy: event.conductedBy,
      targetAudience: event.targetAudience,
      image: null,
    });
  };

  return (
    <div className="max-w-5xl text-gray-700 mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        {editingId ? "Edit Event" : "Add New Event"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-200"
      >
        {/* Title */}
        <div className="flex flex-col">
          <label htmlFor="title" className="text-gray-700 font-medium mb-1">
            Event Title<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="e.g. Mock Interview Workshop"
            value={formData.title}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label htmlFor="category" className="text-gray-700 font-medium mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            {[
              "Training",
              "Workshop",
              "Industry Visit",
              "Placement Drive",
              "Seminar",
              "Guest Lecture",
              "Other",
            ].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div className="flex flex-col">
          <label htmlFor="eventDate" className="text-gray-700 font-medium mb-1">
            Event Date<span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="eventDate"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Conducted By */}
        <div className="flex flex-col">
          <label
            htmlFor="conductedBy"
            className="text-gray-700 font-medium mb-1"
          >
            Conducted By
          </label>
          <input
            type="text"
            id="conductedBy"
            name="conductedBy"
            placeholder="e.g. Infosys Foundation"
            value={formData.conductedBy}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Target Audience */}
        <div className="flex flex-col">
          <label
            htmlFor="targetAudience"
            className="text-gray-700 font-medium mb-1"
          >
            Target Audience
          </label>
          <input
            type="text"
            id="targetAudience"
            name="targetAudience"
            placeholder="e.g. Final Year CS Students"
            value={formData.targetAudience}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Image */}
        <div className="flex flex-col">
          <label htmlFor="image" className="text-gray-700 font-medium mb-1">
            Event Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="border border-gray-300 rounded-lg px-3 py-2 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col col-span-full">
          <label
            htmlFor="description"
            className="text-gray-700 font-medium mb-1"
          >
            Description<span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter a brief summary of the event..."
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="col-span-full flex justify-center mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition-all duration-200"
          >
            {editingId ? "Update Event" : "Create Event"}
          </button>
        </div>
      </form>
      <h2 className="text-xl font-semibold mb-2 mt-10">All Events</h2>
      <div className="space-y-3">
        {events.map((event) => (
          <div
            key={event._id}
            className="flex items-center justify-between bg-white shadow p-3 rounded"
          >
            <div className="flex items-center gap-4">
              <img
                src={event.image?.url}
                alt={event.title}
                className="w-20 h-16 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(event.eventDate).toLocaleDateString()} |{" "}
                  {event.category}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(event)}
                className="bg-yellow-400 px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(event._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
