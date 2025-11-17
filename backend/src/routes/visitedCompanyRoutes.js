import express from "express";
import multer from "multer";
import storage from "../config/cloudinaryStorage.js";

import {
  createVisitedCompany,
  getAllVisitedCompanies,
  getVisitedCompanyById,
  updateVisitedCompany,
  deleteVisitedCompany,
} from "../controllers/visitedCompanyController.js";

const router = express.Router();
const upload = multer({ storage });

router.get("/", getAllVisitedCompanies);
router.get("/:id", getVisitedCompanyById);

router.post("/", upload.single("image"), createVisitedCompany);
router.put("/:id", upload.single("image"), updateVisitedCompany);
router.delete("/:id", deleteVisitedCompany);

export default router;
