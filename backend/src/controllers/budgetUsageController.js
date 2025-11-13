import Budget from "../models/budgetModel.js";
import CompanyExpense from "../models/companyExpenseModel.js";

// ⭐ Get total budget + total used + remaining
export const getBudgetUsage = async (req, res) => {
  try {
    const budgetDoc = await Budget.findOne();
    const totalBudget = budgetDoc ? budgetDoc.totalBudget : 5000;

    const allExpenses = await CompanyExpense.find({
      approvedByOfficer: true,   // ⭐ Only approved expenses counted
    });

    const totalUsed = allExpenses.reduce((sum, exp) => sum + exp.totalAmount, 0);

    const remaining = totalBudget - totalUsed;

    res.json({
      totalBudget,
      totalUsed,
      remaining,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
