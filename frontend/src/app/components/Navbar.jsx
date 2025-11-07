"use client";

import Link from "next/link";
import { Briefcase } from "lucide-react";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white shadow-sm sticky top-0 z-50">
      {/* Left Side — Logo */}
      <Link href="/" className="flex items-center gap-2">
        <Briefcase className="text-blue-600" />
        <span className="font-semibold text-lg text-gray-800">
          KPT Training & Placements
        </span>
      </Link>

      {/* Right Side — Navigation */}
      <div className="flex items-center gap-6 text-gray-800">
        <Link href="/about">About</Link>
        <Link href="/recruiters">Recruiters</Link>
        <Link href="/statistics">Statistics</Link>
        <Link href="/studentsPlaced">Students Placed</Link>
        <Link
          href="https://www.kptplacements.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Internship
        </Link>
        <Link href="/industry-visits">Industry Visit</Link>
        <Link href="/contact">Contact</Link>

        {/* Clerk Authentication Section */}
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-blue-700 text-white px-4 py-1.5 rounded-lg hover:bg-blue-800 transition">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <Link
            href="/admin"
            className="font-semibold text-blue-700 hover:text-blue-900"
          >
            Dashboard
          </Link>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </nav>
  );
}
