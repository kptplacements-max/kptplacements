import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import placementRoutes from "./src/routes/placementRoutes.js";
import visitedCompanyRoutes from "./src/routes/visitedCompanyRoutes.js";

import placedStudentRoutes from "./src/routes/placedStudentRoutes.js";
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Base route
app.get("/", (req, res) => res.send("KPT Placement API Running ✅"));

// API routes
app.use("/api/placements", placementRoutes);
app.use("/api/placed-students", placedStudentRoutes);
app.use("/api/visited-companies", visitedCompanyRoutes);
app.use("/api/placed-students", placedStudentRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
