import express from "express";
import {
  createPlacedStudent,
  getAllPlacedStudents,
  getPlacedStudentById,
  updatePlacedStudent,
  deletePlacedStudent,
} from "../controllers/placedStudentController.js";

const router = express.Router();

// CRUD Endpoints
router.post("/", createPlacedStudent); // Add new student
router.get("/", getAllPlacedStudents); // Get all (supports filters)
router.get("/:id", getPlacedStudentById); // Get single student by ID
router.put("/:id", updatePlacedStudent); // Update student details
router.delete("/:id", deletePlacedStudent); // Delete record

export default router;
