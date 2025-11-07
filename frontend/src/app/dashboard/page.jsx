"use client";

import { useUser, RedirectToSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { BarChart3, FilePlus2, Database, LogOut } from "lucide-react";

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();

  // Wait until Clerk is loaded before accessing user data
  if (!isLoaded) return <div className="text-center py-20">Loading...</div>;

  // Redirect if not signed in
  if (!isSignedIn) return <RedirectToSignIn />;

  // Role-based protection (check safely after isLoaded)
  const role = user?.publicMetadata?.role || "user"; // default fallback
  if (role !== "admin") {
    return (
      <main className="flex items-center justify-center min-h-screen bg-red-50 text-red-700">
        <p className="text-lg font-semibold">
          🚫 You don’t have access to this page.
        </p>
      </main>
    );
  }

  // If authenticated and authorized
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 px-6">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">
          Welcome, {user.firstName || user.username || "User"} 👋
        </h1>
        <p className="text-gray-600 mb-8">
          Here’s your dashboard. You can manage placement data, view statistics,
          and update site content.
        </p>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/add-placement"
            className="p-6 bg-blue-700 text-white rounded-xl flex flex-col items-center justify-center hover:bg-blue-800 transition shadow"
          >
            <FilePlus2 size={32} />
            <span className="mt-3 font-semibold">Add Placement Data</span>
          </Link>

          <Link
            href="/statistics"
            className="p-6 bg-blue-100 text-blue-800 rounded-xl flex flex-col items-center justify-center hover:bg-blue-200 transition shadow"
          >
            <BarChart3 size={32} />
            <span className="mt-3 font-semibold">View Statistics</span>
          </Link>

          <Link
            href="/recruiters"
            className="p-6 bg-blue-100 text-blue-800 rounded-xl flex flex-col items-center justify-center hover:bg-blue-200 transition shadow"
          >
            <Database size={32} />
            <span className="mt-3 font-semibold">View Recruiters</span>
          </Link>
        </div>

        {/* Footer / Profile Info */}
        <div className="mt-12 border-t pt-6 text-gray-600">
          <p className="text-sm">
            Signed in as:{" "}
            <span className="font-medium text-gray-800">
              {user.primaryEmailAddress?.emailAddress}
            </span>
          </p>
          <Link
            href="/sign-out"
            className="inline-flex items-center gap-2 text-red-600 mt-3 hover:text-red-700"
          >
            <LogOut size={16} /> Sign out
          </Link>
        </div>
      </div>
    </main>
  );
}
