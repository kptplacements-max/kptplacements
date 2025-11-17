import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

import {
  createVisitedCompany,
  getAllVisitedCompanies,
  getVisitedCompanyById,
  updateVisitedCompany,
  deleteVisitedCompany,
} from "../controllers/visitedCompanyController.js";

const router = express.Router();

// ------------------------------
// Cloudinary Storage for Multer
// ------------------------------
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "kpt_placements/visited_companies",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

// ======================================
// IMPORTANT: GET ROUTES COME FIRST
// ======================================
router.get("/", getAllVisitedCompanies);
router.get("/:id", getVisitedCompanyById);

// ======================================
// CREATE (multer only for POST)
// ======================================
router.post("/", upload.single("image"), createVisitedCompany);

// ======================================
// UPDATE (multer only for PUT)
// ======================================
router.put("/:id", upload.single("image"), updateVisitedCompany);

// ======================================
// DELETE
// ======================================
router.delete("/:id", deleteVisitedCompany);

export default router;
