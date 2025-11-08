"use client";
import Image from "next/image";

const recruiters = [
  { name: "ABB", logo: "/recruiters/abb.jpg" },
  { name: "ACE Hardware", logo: "/recruiters/ace.jpg" },
  { name: "Advaith Hyundai", logo: "/recruiters/advaith.jpg" },
  { name: "Asian Paints", logo: "/recruiters/asian paints.jpg" },
  { name: "Bell O Seal Valves", logo: "/recruiters/bell.jpg" },
  { name: "Big Bags International", logo: "/recruiters/big bag.jpg" },
  { name: "Birla Paints", logo: "/recruiters/birla paints.jpg" },
  { name: "Brevera", logo: "/recruiters/brevera.jpg" },
  { name: "Capgemini", logo: "/recruiters/cap.jpg" },
  { name: "Cipla", logo: "/recruiters/cipla.jpg" },
  { name: "Cronus Steel", logo: "/recruiters/cronus.jpg" },
  { name: "Epsilon Group", logo: "/recruiters/epsilon.jpg" },
  { name: "Godrej", logo: "/recruiters/godrej.jpg" },
  { name: "Hindalco (Aditya Birla)", logo: "/recruiters/hindalco.jpg" },
  { name: "JCB", logo: "/recruiters/jcb.jpg" },
  { name: "JSW Steel", logo: "/recruiters/jsw.jpg" },
  { name: "Kalyani Motors", logo: "/recruiters/kalyani.jpg" },
  { name: "KEC International", logo: "/recruiters/kec.png" },
  {
    name: "MCF (Mangalore Chemicals & Fertilizers)",
    logo: "/recruiters/mcf.jpg",
  },
  { name: "Mistral Solutions", logo: "/recruiters/mistral.jpg" },
  { name: "Reflex Group (RLFC)", logo: "/recruiters/RLFC.jpg" },
  { name: "Saint-Gobain", logo: "/recruiters/saint.jpg" },
  { name: "Schneider Electric", logo: "/recruiters/schnieder.png" },
  { name: "Sobha Ltd.", logo: "/recruiters/shobha.jpg" },
  { name: "Tata Power", logo: "/recruiters/tata power.jpg" },
  { name: "Tata Motors", logo: "/recruiters/tata.jpg" },
  { name: "ThoughtWorks", logo: "/recruiters/thoughtworks.png" },
  { name: "TIEI India", logo: "/recruiters/tiei.jpg" },
  { name: "Toyota Kirloskar", logo: "/recruiters/toyota.jpg" },
  { name: "Trelleborg", logo: "/recruiters/trelleborg.jpg" },
  { name: "TVS Motors", logo: "/recruiters/tvs.jpg" },
  { name: "UltraTech Cement", logo: "/recruiters/ultratech.jpg" },
  { name: "Vidya Herbs", logo: "/recruiters/vidya herbs.jpg" },
  { name: "Volvo", logo: "/recruiters/volvo.jpg" },
  { name: "Winman Software", logo: "/recruiters/winman.jpg" },
  { name: "Wipro", logo: "/recruiters/wipro.png" },
];

export default function TopRecruiters() {
  return (
    <section className="relative py-16 bg-gradient-to-r from-blue-50 via-white to-blue-50 border-t border-gray-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-3">
          Our Top Recruiters
        </h2>
        <p className="text-gray-500 mb-10">
          Trusted by leading industries and organizations
        </p>

        {/* Scrolling Logos */}
        <div className="overflow-hidden relative">
          <div className="scroll-track flex gap-14 items-center">
            {[...recruiters, ...recruiters].map((r, i) => (
              <Logo key={i} {...r} />
            ))}
          </div>
        </div>
      </div>

      {/* Animation & Styling */}
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

      {/* Fading edges */}
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
