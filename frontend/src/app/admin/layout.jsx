"use client";
import { useUser, RedirectToSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const pathname = usePathname();

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <RedirectToSignIn />;

  const role = user?.publicMetadata?.role;

  // Allow only these 3 roles
 if (
  role !== "principal" &&
  role !== "placement-coordinator" &&
  role !== "placement-officer" &&
  role !== "sw-officer"
)
{
    return (
      <main className="flex items-center justify-center min-h-screen bg-red-50 text-red-700">
        <p className="text-lg font-semibold">🚫 Admin access only.</p>
      </main>
    );
  }

  const linkClass = (path) =>
    pathname === path
      ? "font-semibold text-blue-600"
      : "text-gray-700 hover:text-blue-500";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="font-bold text-blue-700 text-lg mb-2">Admin Panel</h2>

        {/* User info */}
        <div className="mb-6 p-3 bg-blue-50 rounded border border-blue-200">
          <p className="text-sm text-gray-700">
            Logged in as:
            <span className="font-semibold text-blue-700"> {user.fullName}</span>
          </p>
          <p className="text-xs text-gray-600 capitalize">
            Role: <strong>{role}</strong>
          </p>
        </div>

        {/* NAVIGATION */}
        <nav className="flex flex-col gap-3">

          {/* -------------------------------------------------- */}
          {/* PLACEMENT COORDINATOR MENU */}
          {/* -------------------------------------------------- */}
          {role === "placement-coordinator" && (
            <>
              <Link href="/admin" className={linkClass("/admin")}>
                Dashboard
              </Link>

              <Link href="/admin/statistics" className={linkClass("/admin/statistics")}>
                Placement Statistics
              </Link>

              <Link href="/admin/placedStudents" className={linkClass("/admin/placedStudents")}>
                Placed Students Page
              </Link>

              <Link
                href="/admin/recentlyVisitedCompanies"
                className={linkClass("/admin/recentlyVisitedCompanies")}
              >
                Recently Visited Companies
              </Link>

              <Link
                href="/admin/addexpenses"
                className={linkClass("/admin/addexpenses")}
              >
                Add Expenses
              </Link>

              <Link href="/admin/announcements" className={linkClass("/admin/announcements")}>
                Announcements
              </Link>

              <Link href="/admin/events" className={linkClass("/admin/events")}>
                Events
              </Link>

              <Link href="/admin/team" className={linkClass("/admin/team")}>
                Our Team
              </Link>

              <Link href="/admin/gallery" className={linkClass("/admin/gallery")}>
                Gallery Photos
              </Link>

              <Link href="/admin/recruiterLogos" className={linkClass("/admin/recruiterLogos")}>
                Recruiter Logos
              </Link>

              <Link href="/admin/homeHero" className={linkClass("/admin/homeHero")}>
                Homepage Images
              </Link>
            </>
          )}

          {/* -------------------------------------------------- */}
          {/* PLACEMENT OFFICER MENU */}
          {/* -------------------------------------------------- */}
          {role === "placement-officer" && (
            <>
              <Link
                href="/admin/placementExpenses"
                className={linkClass("/admin/placementExpenses")}
              >
                Review Expenses
              </Link>
            </>
          )}

          {/* -------------------------------------------------- */}
          {/* PRINCIPAL MENU */}
          {/* -------------------------------------------------- */}
          {role === "principal" && (
  <>
    <Link
      href="/admin/principalReviewExpenses"
      className={linkClass("/admin/principalReviewExpenses")}
    >
      Approve Expenses
    </Link>

    <Link
      href="/admin/principalBudget"
      className={linkClass("/admin/principalBudget")}
    >
      Manage Budget
    </Link>
  </>
)}
{/* -------------------------------------------------- */}
{/* SW-OFFICER MENU */}
{/* -------------------------------------------------- */}
{role === "sw-officer" && (
  <>
    <Link
      href="/admin/swOfficerExpenses"
      className={linkClass("/admin/swOfficerExpenses")}
    >
      SW Officer – Review Expenses
    </Link>
  </>
)}


        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
