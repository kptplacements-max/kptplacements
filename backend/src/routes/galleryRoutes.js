import express from "express";
import multer from "multer";
import storage from "../config/cloudinaryStorage.js";

import {
  createGalleryPhoto,
  getAllGalleryPhotos,
  deleteGalleryPhoto,
  updateGalleryPhoto,
} from "../controllers/galleryController.js";

const router = express.Router();
const upload = multer({ storage });

router.post("/", upload.single("image"), createGalleryPhoto);
router.get("/", getAllGalleryPhotos);
router.delete("/:id", deleteGalleryPhoto);
router.put("/:id", upload.single("image"), updateGalleryPhoto);

export default router;
