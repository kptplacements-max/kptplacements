import express from "express";
import multer from "multer";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

const router = express.Router();

// Setup multer for image upload
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Routes
router.post("/", upload.single("image"), createEvent);
router.get("/", getEvents);
router.get("/:id", getEventById);
router.put("/:id", upload.single("image"), updateEvent);
router.delete("/:id", deleteEvent);

export default router;
