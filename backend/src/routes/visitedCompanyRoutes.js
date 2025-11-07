import express from "express";
import {
  createVisitedCompany,
  getAllVisitedCompanies,
  getVisitedCompanyById,
  updateVisitedCompany,
  deleteVisitedCompany,
} from "../controllers/visitedCompanyController.js";

const router = express.Router();

router.post("/", createVisitedCompany);
router.get("/", getAllVisitedCompanies);
router.get("/:id", getVisitedCompanyById);
router.put("/:id", updateVisitedCompany);
router.delete("/:id", deleteVisitedCompany);

export default router;
