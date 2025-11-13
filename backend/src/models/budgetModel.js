import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    totalBudget: {
      type: Number,
      default: 5000, // ⭐ DEFAULT 5000
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Budget", budgetSchema);
