"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react"; // optional icon for close button

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/events`);
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };
    fetchEvents();
  }, [baseURL]);

  return (
    <div className="min-h-screen bg-white text-gray-900 max-w-8xl mx-auto p-6 relative">
      <h1 className="text-3xl font-bold mb-6 text-center">Placement Events</h1>

      {events.length === 0 ? (
        <p className="text-center text-gray-500">No events available yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="border rounded-lg shadow hover:shadow-md overflow-hidden bg-white"
            >
              <img
                src={event.image?.url || "/placeholder.jpg"}
                alt={event.title}
                className="w-full h-48 object-cover cursor-pointer transition-transform duration-200 hover:scale-105"
                onClick={() => setSelectedImage(event.image?.url)} // ✅ open modal on click
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(event.eventDate).toLocaleDateString()} |{" "}
                  {event.category}
                </p>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Modal Overlay */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative max-w-4xl w-full px-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-8 right-0 text-white hover:text-red-400 transition"
              aria-label="Close"
            >
              <X size={28} />
            </button>
            <img
              src={selectedImage}
              alt="Expanded Event"
              className="w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
