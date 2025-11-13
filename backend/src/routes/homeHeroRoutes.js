import express from "express";
import multer from "multer";
import {
  uploadHeroImage,
  getHeroImages,
  deleteHeroImage,
} from "../controllers/homeHeroController.js";

const router = express.Router();
const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post("/", upload.single("image"), uploadHeroImage);
router.get("/", getHeroImages);
router.delete("/:id", deleteHeroImage);

export default router;
