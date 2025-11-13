"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

export default function TopRecruiters() {
  const [logos, setLogos] = useState([]);
  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/recruiter-logos`);
        setLogos(res.data);
      } catch (err) {
        console.error("Failed to fetch recruiter logos:", err);
      }
    };
    fetchLogos();
  }, []);

  return (
    <section className="relative py-16 bg-gradient-to-r from-blue-50 via-white to-blue-50 border-t border-gray-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-3">
          Our Top Recruiters
        </h2>
        <p className="text-gray-500 mb-10">
          Trusted by leading industries and organizations
        </p>

        {logos.length === 0 ? (
          <p className="text-gray-400">No recruiter logos uploaded yet.</p>
        ) : (
          <div className="overflow-hidden relative">
            <div className="scroll-track flex gap-14 items-center">
              {[...logos, ...logos].map((r, i) => (
                <Logo key={i} logo={r.image?.url} name={r.name} />
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .scroll-track {
          display: inline-flex;
          white-space: nowrap;
          animation: scroll 60s linear infinite;
        }
        .scroll-track:hover {
          animation-play-state: paused;
        }
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>

      <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-blue-50 via-blue-50/70 to-transparent pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-blue-50 via-blue-50/70 to-transparent pointer-events-none"></div>
    </section>
  );
}

function Logo({ logo, name }) {
  return (
    <div className="flex-shrink-0 text-center transition-transform duration-300 hover:scale-105">
      <div className="bg-white rounded-md shadow-sm hover:shadow-lg p-3 w-[150px] h-[110px] flex items-center justify-center mx-auto">
        <Image
          src={logo}
          alt={name}
          width={120}
          height={60}
          className="object-contain"
        />
      </div>
      <p className="mt-2 text-sm text-gray-600 font-medium">{name}</p>
    </div>
  );
}
