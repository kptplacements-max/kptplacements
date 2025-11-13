import express from "express";
import { getBudgetUsage } from "../controllers/budgetUsageController.js";

const router = express.Router();

router.get("/", getBudgetUsage);

export default router;
