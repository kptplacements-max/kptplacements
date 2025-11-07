"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Briefcase, Menu, X, ChevronDown } from "lucide-react";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const mainLinks = [
    { href: "/about", label: "About" },
    { href: "/statistics", label: "Statistics" },
    { href: "/studentsPlaced", label: "Students Placed" },
    { href: "/recentlyVisitedCompanies", label: "Visited Companies" },
    { href: "/events", label: "Events" },
  ];

  const dropdownLinks = [
    { href: "/recruiters", label: "Recruiters" },
    {
      href: "https://www.kptplacements.org",
      label: "Internship",
      external: true,
    },
    { href: "/industry-visits", label: "Industry Visit" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2">
            <Briefcase className="text-blue-600 w-6 h-6" />
            <span className="font-semibold text-lg text-gray-800">
              KPT Training & Placements
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 text-gray-700">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative font-medium hover:text-blue-700 transition
                  ${
                    pathname === link.href
                      ? "text-blue-700 font-semibold after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-blue-700"
                      : ""
                  }`}
              >
                {link.label}
              </Link>
            ))}

            {/* More Dropdown (fixed flicker-free) */}
            <div className="relative group">
              <button className="flex items-center gap-1 font-medium hover:text-blue-700 transition">
                More
                <ChevronDown className="h-4 w-4 group-hover:rotate-180 transition-transform" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 ease-out pointer-events-none group-hover:pointer-events-auto">
                {dropdownLinks.map((link) =>
                  link.external ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition ${
                        pathname === link.href
                          ? "bg-blue-50 text-blue-700 font-semibold"
                          : ""
                      }`}
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </div>
            </div>

            {/* Clerk Section */}
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
                className={`font-semibold ${
                  pathname.startsWith("/admin")
                    ? "text-blue-700 underline"
                    : "text-blue-700 hover:text-blue-900"
                }`}
              >
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 hover:text-blue-700 focus:outline-none"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm shadow-md border-t border-gray-100">
          <div className="flex flex-col space-y-3 px-6 py-4">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block font-medium text-gray-700 hover:text-blue-700 transition ${
                  pathname === link.href ? "text-blue-700 font-semibold" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Dropdown Section in Mobile */}
            <div className="border-t border-gray-200 pt-2">
              <p className="text-gray-500 font-semibold mb-1">More</p>
              {dropdownLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block font-medium text-gray-700 hover:text-blue-700 transition"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block font-medium text-gray-700 hover:text-blue-700 transition ${
                      pathname === link.href
                        ? "text-blue-700 font-semibold"
                        : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>

            {/* Auth Section */}
            <div className="pt-3 border-t border-gray-200">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="w-full bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <div className="flex justify-between items-center mt-2">
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="font-semibold text-blue-700 hover:text-blue-900"
                  >
                    Dashboard
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
