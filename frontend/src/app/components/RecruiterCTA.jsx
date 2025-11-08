"use client";
import Link from "next/link";
import { Briefcase } from "lucide-react";

export default function RecruiterCTA() {
  return (
    <section className="bg-blue-700 text-white py-16 text-center">
      <div className="max-w-4xl mx-auto px-6">
        <Briefcase className="w-10 h-10 mx-auto mb-4 text-blue-200" />
        <h2 className="text-3xl font-bold mb-3">
          Want to Collaborate or Recruit from KPT?
        </h2>
        <p className="text-blue-100 mb-6">
          Join hands with Karnataka Government Polytechnic, Mangalore — and
          discover skilled diploma talent across diverse engineering branches.
        </p>
        <Link
          href="/contact"
          className="bg-white text-blue-700 font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-50 transition"
        >
          Contact Placement Officer
        </Link>
      </div>
    </section>
  );
}
