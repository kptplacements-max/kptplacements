import mongoose from "mongoose";

const placementBudgetSchema = new mongoose.Schema(
  {
    // Principal sets the total placement cell budget (example: ₹50,000)
    totalBudget: {
      type: Number,
      required: true,
      default: 50000,
    },

    // Automatically updated whenever expenses are added/edited/deleted
    spentAmount: {
      type: Number,
      default: 0,
    },

    // Always equal to totalBudget - spentAmount
    remainingAmount: {
      type: Number,
      default: 50000,
    },
  },
  { timestamps: true }
);

export default mongoose.model("PlacementBudget", placementBudgetSchema);
