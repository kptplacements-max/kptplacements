import express from "express";
import {
  createPlacement,
  getAllPlacements,
  getPlacementByYear,
  updatePlacement,
  deletePlacement,
  addProgramToYear,
  deleteProgramFromYear,
} from "../controllers/placementController.js";

const router = express.Router();

// --- MAIN PLACEMENT ROUTES --- //
router.get("/", getAllPlacements);
router.get("/:year", getPlacementByYear);
router.post("/", createPlacement);
router.put("/:year", updatePlacement);
router.delete("/:year", deletePlacement);

// --- PROGRAM-LEVEL ROUTES --- //
router.post("/:year/programs", addProgramToYear);
router.delete("/:year/programs/:program", deleteProgramFromYear);

export default router;
