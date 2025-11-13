import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// ✅ Define public (unprotected) routes
const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/contact",
  "/recruiters",
  "/statistics",
  "/announcements",
  "/ourTeam",
  "/events",
  "/api/(.*)", // allow API requests
]);

export default clerkMiddleware((auth, req) => {
  // Public pages don't need authentication
  if (isPublicRoute(req)) return;

  // Protect all other routes (like /admin/**)
  auth.protect();
});

export const config = {
  matcher: [
    // Apply Clerk middleware to all routes except static files and Next internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
