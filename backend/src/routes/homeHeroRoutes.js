import express from "express";
import multer from "multer";
import storage from "../config/cloudinaryStorage.js";

import {
  uploadHeroImage,
  getHeroImages,
  deleteHeroImage,
  updateHeroOrder,   // <-- ADD THIS LINE
} from "../controllers/homeHeroController.js";


const router = express.Router();
const upload = multer({ storage });

router.post("/", upload.single("image"), uploadHeroImage);
router.get("/", getHeroImages);
router.delete("/:id", deleteHeroImage);
router.put("/update-order", updateHeroOrder);

export default router;
