import express from "express";
import multer from "multer";
import {
  createRecruiterLogo,
  getRecruiterLogos,
  deleteRecruiterLogo,
  updateRecruiterLogo,
} from "../controllers/recruiterLogoController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Routes
router.post("/", upload.single("image"), createRecruiterLogo);
router.get("/", getRecruiterLogos);
router.delete("/:id", deleteRecruiterLogo);
router.put("/:id", upload.single("image"), updateRecruiterLogo); // 👈 Added

export default router;
