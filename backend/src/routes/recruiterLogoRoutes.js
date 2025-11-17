import express from "express";
import multer from "multer";
import storage from "../config/cloudinaryStorage.js";

import {
  createRecruiterLogo,
  getRecruiterLogos,
  deleteRecruiterLogo,
  updateRecruiterLogo,
} from "../controllers/recruiterLogoController.js";

const router = express.Router();
const upload = multer({ storage });

router.post("/", upload.single("image"), createRecruiterLogo);
router.get("/", getRecruiterLogos);
router.delete("/:id", deleteRecruiterLogo);
router.put("/:id", upload.single("image"), updateRecruiterLogo);

export default router;
