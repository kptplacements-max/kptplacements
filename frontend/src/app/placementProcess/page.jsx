"use client";

import Link from "next/link";
import { Building2, Mail, CheckCircle, GraduationCap } from "lucide-react";

export default function PlacementProcessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 text-gray-800">
      {/* ===== Hero Section ===== */}
      <section className="relative  px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-bg-pattern.svg')] opacity-5 bg-center bg-cover"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl mt-10 font-extrabold text-blue-900 tracking-tight">
            Placement Process at KPT Mangalore
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mt-4 max-w-2xl mx-auto leading-relaxed">
            A transparent, structured, and collaborative approach connecting our
            students with industry leaders.
          </p>
          <div className="mt-6 flex justify-center">
            <div className="w-24 h-1 bg-blue-700 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* ===== Main Content ===== */}
      <section className="max-w-7xl mx-auto py-16 px-6 md:px-10 space-y-16">
        {/* Intro */}
        <div className="text-center">
          <p className="text-lg leading-relaxed text-gray-700 max-w-7xl mx-auto">
            The <strong>Training & Placement Cell</strong> at{" "}
            <strong>Karnataka Government Polytechnic, Mangalore</strong> acts as
            the pivotal link between students and the industry — ensuring a
            smooth recruitment experience and fostering long-term institutional
            collaboration.
          </p>
        </div>

        {/* Step 1 */}
        <ProcessBlock
          icon={<Mail className="text-blue-700 w-8 h-8" />}
          title="Step 1: Initiating a Placement Drive"
          desc="Companies interested in recruiting from KPT Mangalore can begin by reaching out to the Training & Placement Cell through an official email."
          points={[
            "Send an email to the Placement Officer at kptplacements@gmail.com expressing interest to conduct a placement drive.",
            "Mention job roles, eligibility criteria, salary package, work location, and registration link (if any).",
            "Upon receipt, the Placement Cell reviews the proposal and discusses feasibility with Heads of Departments and Placement Coordinators.",
            "Based on student interest and course relevance, suitable dates are suggested and finalized in consultation with the company.",
            "Once confirmed, the placement drive is officially scheduled and announced to students.",
          ]}
          highlight="Recruitment can be conducted on-campus, virtually (online), or as a pool campus event depending on company preference."
        />

        {/* Step 2 */}
        <ProcessBlock
          icon={<Building2 className="text-blue-700 w-8 h-8" />}
          title="Step 2: Placement Process for Companies"
          desc="The Placement Cell ensures all corporate engagement follows transparent and standardized procedures for efficiency and fairness."
          points={[
            "Companies must disclose full job details — training period, pay scale, work location, facilities, and bond terms — during the Pre-Placement Interaction (PPI).",
            "All communication must route through the Placement Cell; direct contact with students is discouraged.",
            "Final selection lists should be submitted to the Placement Officer within a week of interviews.",
            "Offer letters must be addressed to the Placement Officer, who will officially distribute them to selected students.",
            "Companies offering internships to final-year students can coordinate with the Cell for approval and scheduling.",
          ]}
        />

        {/* Step 3 */}
        <ProcessBlock
          icon={<CheckCircle className="text-blue-700 w-8 h-8" />}
          title="Step 3: Our Mutual Commitment"
          desc="We believe in nurturing sustainable, ethical, and growth-oriented collaborations with our corporate partners."
          points={[
            "Over 75 years of academic excellence and trust in technical education.",
            "Transparent, fair, and systematic placement processes for both companies and students.",
            "Proactive support from faculty coordinators and student representatives for seamless execution.",
            "Commitment to ensuring student professionalism, discipline, and readiness for industry challenges.",
          ]}
          highlight="KPT Mangalore proudly welcomes corporate partners for on-campus, virtual, and joint (pool) recruitment drives."
        />

        {/* CTA */}
        <div className="text-center mt-20">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-blue-700 text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition font-semibold shadow-md hover:shadow-lg"
          >
            <GraduationCap className="w-5 h-5" />
            Contact Placement Officer
          </Link>
          <p className="mt-4 text-gray-600 text-sm">
            For placement or internship collaborations, please write to{" "}
            <a
              href="mailto:kptplacements@gmail.com"
              className="text-blue-700 font-medium hover:underline"
            >
              kptplacements@gmail.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}

/* ====== Component: Process Block ====== */
function ProcessBlock({ icon, title, desc, points, highlight }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm border border-gray-100 shadow-lg rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-blue-100 rounded-full">{icon}</div>
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
      </div>
      <p className="text-gray-700 mb-4">{desc}</p>
      <ul className="list-disc pl-6 text-gray-700 space-y-1 leading-relaxed">
        {points.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
      {highlight && (
        <div className="mt-4 bg-blue-50 border-l-4 border-blue-600 p-3 rounded-md text-blue-800 italic">
          {highlight}
        </div>
      )}
    </div>
  );
}
