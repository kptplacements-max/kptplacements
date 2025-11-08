import express from "express";
import multer from "multer";
import {
  createMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
} from "../controllers/teamController.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Routes
router.post("/", upload.single("image"), createMember);
router.get("/", getMembers);
router.get("/:id", getMemberById);
router.put("/:id", upload.single("image"), updateMember);
router.delete("/:id", deleteMember);

export default router;
