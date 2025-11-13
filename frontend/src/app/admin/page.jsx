//admin/page.jsx
"use client";
import Link from "next/link";

export default function AdminHome() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-800 mb-4">
        Welcome, Admin 👋
      </h1>
      <p className="text-gray-600 mb-8">
        Manage Training & Placement data for KPT Mangalore here.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Existing Links */}
        <Link
          href="/admin/statistics"
          className="p-6 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-all"
        >
          Manage Placement Statistics
        </Link>

        <Link
          href="/admin/companies"
          className="p-6 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-all"
        >
          Add Visited Companies
        </Link>

        <Link
          href="/admin/gallery"
          className="p-6 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-all"
        >
          Upload Gallery Photos
        </Link>

        {/* 🆕 New Admin Pages */}

        <Link
          href="/admin/recruiterLogos"
          className="p-6 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-all"
        >
          Upload Recruiter Logos
        </Link>

        <Link
  href="/admin/homeHero"
  className="p-6 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-all"
>
  Manage Homepage Hero Images
</Link>


        <Link
          href="/admin/events"
          className="p-6 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-all"
        >
          Manage Placement Events
        </Link>
      </div>
    </div>
  );
}
