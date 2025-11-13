import express from "express";
import multer from "multer";
import {
  createPlacedStudent,
  getAllPlacedStudents,
  updatePlacedStudent,
  deletePlacedStudent,
} from "../controllers/placedStudentController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Routes
router.post("/", upload.single("image"), createPlacedStudent);
router.get("/", getAllPlacedStudents);
router.put("/:id", upload.single("image"), updatePlacedStudent);
router.delete("/:id", deletePlacedStudent);

export default router;
