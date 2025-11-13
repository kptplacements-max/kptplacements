import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import connectDB from "./src/config/db.js";

import homeHeroRoutes from "./src/routes/homeHeroRoutes.js";
import placementRoutes from "./src/routes/placementRoutes.js";
import visitedCompanyRoutes from "./src/routes/visitedCompanyRoutes.js";
import eventRoutes from "./src/routes/eventRoutes.js";
import placedStudentRoutes from "./src/routes/placedStudentRoutes.js";
import teamRoutes from "./src/routes/teamRoutes.js";
import announcementRoutes from "./src/routes/announcementRoutes.js";
import recruiterLogoRoutes from "./src/routes/recruiterLogoRoutes.js";
import companyExpenseRoutes from "./src/routes/companyExpenseRoutes.js";   // ✅ ADD THIS
import budgetRoutes from "./src/routes/budgetRoutes.js";   // ⭐ ADD THIS
import budgetUsageRoutes from "./src/routes/budgetUsageRoutes.js";
// Connect DB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("KPT Placement API Running ✅"));

// Routes
app.use("/api/placements", placementRoutes);
app.use("/api/placed-students", placedStudentRoutes);
app.use("/api/visited-companies", visitedCompanyRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/recruiter-logos", recruiterLogoRoutes);
app.use("/api/home-hero", homeHeroRoutes);
app.use("/api/company-expenses", companyExpenseRoutes); // ✅ FIX HERE
app.use("/api/budget", budgetRoutes);   // ⭐ ADD THIS
app.use("/api/budget-usage", budgetUsageRoutes);
// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
