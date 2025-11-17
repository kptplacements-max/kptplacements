import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

import {
  createVisitedCompany,
  getAllVisitedCompanies,
  getVisitedCompanyById,
  updateVisitedCompany,
  deleteVisitedCompany,
} from "../controllers/visitedCompanyController.js";

const router = express.Router();

// Temporary local upload folder
const upload = multer({ dest: "uploads/" });

// GET ROUTES
router.get("/", getAllVisitedCompanies);
router.get("/:id", getVisitedCompanyById);

// CREATE
router.post("/", upload.single("image"), createVisitedCompany);

// UPDATE
router.put("/:id", upload.single("image"), updateVisitedCompany);

// DELETE
router.delete("/:id", deleteVisitedCompany);

export default router;
