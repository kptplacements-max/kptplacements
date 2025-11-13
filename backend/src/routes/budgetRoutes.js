import express from "express";
import { getBudget, updateBudget } from "../controllers/budgetController.js";

const router = express.Router();

router.get("/", getBudget);      // ⭐ GET 5000 default
router.post("/", updateBudget);  // ⭐ Update budget

export default router;
