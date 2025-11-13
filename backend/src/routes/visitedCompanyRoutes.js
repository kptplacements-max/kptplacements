import express from "express";
import multer from "multer";
import {
  createVisitedCompany,
  getAllVisitedCompanies,
  getVisitedCompanyById,
  updateVisitedCompany,
  deleteVisitedCompany,
} from "../controllers/visitedCompanyController.js";

const router = express.Router();

// Multer config
const upload = multer({ dest: "uploads/" });

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
