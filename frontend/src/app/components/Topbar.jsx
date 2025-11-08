"use client";

import {
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

export default function Topbar() {
  return (
    <div className="w-full bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 text-white shadow-md backdrop-blur-sm px-3 md:px-8 py-2 text-sm flex flex-col md:flex-row items-center justify-between z-[9999]">
      {/* Left Section */}
      <div className="flex items-center gap-6 mb-2 md:mb-0 text-gray-100">
        <div className="flex items-center gap-2">
          <Phone size={16} className="text-yellow-300" />
          <span className="hover:text-white transition-colors">
            (0824) - 3516910 / +91 77604 21790
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Mail size={16} className="text-yellow-300" />
          <span className="hover:text-white transition-colors">
            kptplacements@gmail.com
          </span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <a
          className="hover:text-yellow-300 transition-colors duration-300"
          href="#"
          aria-label="Facebook"
        >
          <Facebook size={18} />
        </a>
        <a
          className="hover:text-yellow-300 transition-colors duration-300"
          href="#"
          aria-label="Twitter"
        >
          <Twitter size={18} />
        </a>
        <a
          className="hover:text-pink-300 transition-colors duration-300"
          href="#"
          aria-label="Instagram"
        >
          <Instagram size={18} />
        </a>
        <a
          className="hover:text-blue-300 transition-colors duration-300"
          href="#"
          aria-label="LinkedIn"
        >
          <Linkedin size={18} />
        </a>
      </div>
    </div>
  );
}
