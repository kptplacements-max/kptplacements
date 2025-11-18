// server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";

import homeHeroRoutes from "./src/routes/homeHeroRoutes.js";
import placementRoutes from "./src/routes/placementRoutes.js";
import visitedCompanyRoutes from "./src/routes/visitedCompanyRoutes.js";
import eventRoutes from "./src/routes/eventRoutes.js";
import placedStudentRoutes from "./src/routes/placedStudentRoutes.js";
import teamRoutes from "./src/routes/teamRoutes.js";
import announcementRoutes from "./src/routes/announcementRoutes.js";
import recruiterLogoRoutes from "./src/routes/recruiterLogoRoutes.js";
import companyExpenseRoutes from "./src/routes/companyExpenseRoutes.js";
import budgetRoutes from "./src/routes/budgetRoutes.js";
import budgetUsageRoutes from "./src/routes/budgetUsageRoutes.js";
import galleryRoutes from "./src/routes/galleryRoutes.js";

// ---------------------- INITIAL CONFIG ----------------------
const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------- CONNECT DATABASE ----------------------
await connectDB();

// ---------------------- CORS CONFIG ----------------------
const allowedOrigins = [
  "http://localhost:5173",
  // 👉 Change this to your actual frontend URL when deployed
  "https://kpt-placement-frontend.vercel.app",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  } else {
    res.header("Access-Control-Allow-Origin", "*");
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// ---------------------- MIDDLEWARES ----------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------- BASE ROUTE ----------------------
app.get("/", (req, res) => {
  res.send("KPT Placement API Running ✅");
});

// ---------------------- API ROUTES ----------------------
app.use("/api/home-hero", homeHeroRoutes);
app.use("/api/placements", placementRoutes);
app.use("/api/placed-students", placedStudentRoutes);
app.use("/api/visited-companies", visitedCompanyRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/recruiter-logos", recruiterLogoRoutes);
app.use("/api/company-expenses", companyExpenseRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/budget-usage", budgetUsageRoutes);
app.use("/api/gallery", galleryRoutes);

// ---------------------- SERVER ----------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ✅ Required export for Vercel deployment
export default app;
