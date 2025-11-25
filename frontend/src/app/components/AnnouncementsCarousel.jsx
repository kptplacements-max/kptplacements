"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function AnnouncementsCarousel() {
  const [announcements, setAnnouncements] = useState([]);
  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/announcements`);
        setAnnouncements(res.data.slice(0, 8)); // show latest 8
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };
    fetchAnnouncements();
  }, [baseURL]);

  if (!announcements.length) return null;

  return (
    <section className="py-12 bg-blue-50">
      <div className="max-w-6xl mx-auto px-6">

        {/* ⭐ Updated Title - Clickable & Hover Effects */}
        <Link href="/announcements">
          <h2
            className="
              text-2xl md:text-3xl font-bold text-blue-800 mb-6 text-center
              cursor-pointer transition-colors hover:text-blue-900 hover:underline
            "
          >
            Latest Announcements & Events
          </h2>
        </Link>

        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-3">
          {announcements.map((a) => (
            <Link
              key={a._id}
              href={`/announcements/${a._id}`}
              className="
                flex-none w-72 bg-white rounded-xl shadow 
                hover:shadow-xl transition-all hover:-translate-y-1
                border border-gray-200 p-5 cursor-pointer group
              "
            >
              <h3 className="font-semibold text-lg text-blue-700 mb-2 line-clamp-2 group-hover:text-blue-900 transition">
                {a.title}
              </h3>

              <p className="text-sm text-gray-500 mb-1 group-hover:text-gray-700 transition">
                {new Date(a.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>

              <p className="text-sm text-gray-600 line-clamp-3 mb-3 group-hover:text-gray-800 transition">
                {a.description}
              </p>

              <p className="text-sm font-medium text-blue-700 group-hover:text-blue-900 underline transition">
                View Announcement →
              </p>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
