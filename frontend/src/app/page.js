"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Building2, Users, GraduationCap, Briefcase } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import AnnouncementsCarousel from "./components/AnnouncementsCarousel";
import TopRecruiters from "./components/TopRecruiters";
import RecruiterCTA from "./components/RecruiterCTA";
import AboutSection from "./components/AboutSection";

export default function Home() {
  const [heroImages, setHeroImages] = useState([]);
  const [current, setCurrent] = useState(0);
  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  // ✅ Fetch all hero images from backend
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/home-hero`);
        if (res.data.length > 0) {
          setHeroImages(res.data);
        } else {
          // Fallback if no image uploaded yet
          setHeroImages([{ image: { url: "/placeholder.jpg" } }]);
        }
      } catch (err) {
        console.error("Failed to load hero images:", err);
        setHeroImages([{ image: { url: "/placeholder.jpg" } }]);
      }
    };
    fetchImages();
  }, [baseURL]);

  // ✅ Slideshow auto-transition
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 5000); // change every 5 seconds
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <>
      {/* 🏔️ Hero Section */}
      <section className="relative h-[85vh] flex flex-col items-center justify-center text-white overflow-hidden">
        {/* Background image slideshow */}
        {heroImages.map((img, index) => (
          <Image
            key={index}
            src={img.image?.url || "/placeholder.jpg"}
            alt={`Hero ${index + 1}`}
            fill
            priority={index === 0}
            className={`object-cover transition-opacity duration-[2000ms] ease-in-out ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-blue-800/50 to-blue-900/80"></div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-lg">
            Training & Placement Cell
          </h1>
          <p className="text-lg md:text-xl mb-8 text-blue-100">
            Karnataka Govt. Polytechnic, Mangalore — Bridging Academia and
            Industry.
          </p>

          {/* Stats Section */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mb-10 text-sm md:text-base">
            {[
              {
                icon: <Users className="h-8 w-8 text-blue-200 mb-2" />,
                label: "1500+ Students",
              },
              {
                icon: <Building2 className="h-8 w-8 text-blue-200 mb-2" />,
                label: "150+ Recruiters",
              },
              {
                icon: <GraduationCap className="h-8 w-8 text-blue-200 mb-2" />,
                label: "8 Departments",
              },
              {
                icon: <Briefcase className="h-8 w-8 text-blue-200 mb-2" />,
                label: "40+ Industry Visits",
              },
              {
                icon: <GraduationCap className="h-8 w-8 text-blue-200 mb-2" />,
                label: "20+ Workshops",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-blue-50 hover:scale-105 transition-transform"
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/announcements"
              className="bg-white text-blue-800 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              View Announcements
            </Link>
            <Link
              href="/ourTeam"
              className="border border-white px-6 py-2 rounded-lg hover:bg-white hover:text-blue-800 transition"
            >
              Meet Our Team
            </Link>
          </div>
        </div>
      </section>

      {/* 🧩 Additional Sections */}
      <AboutSection />
      <AnnouncementsCarousel />
      <TopRecruiters />
      <RecruiterCTA />
    </>
  );
}
