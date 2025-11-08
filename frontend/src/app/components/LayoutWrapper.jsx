"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Topbar from "./Topbar";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  // ✅ Hide footer for admin-related routes
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <>
      <Topbar />
      <Navbar />
      <main>{children}</main>
      {!isAdminPage && <Footer />}
    </>
  );
}
