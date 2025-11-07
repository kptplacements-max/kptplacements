import CompanyExpense from "../models/companyExpenseModel.js";
import VisitedCompany from "../models/visitedCompanyModel.js";

// ✅ Add expense entry for a company
export const createExpense = async (req, res) => {
  try {
    const expense = await CompanyExpense.create(req.body);
    await VisitedCompany.findByIdAndUpdate(expense.company, {
      $push: { expenses: expense._id },
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all expenses (optionally filter by company)
export const getAllExpenses = async (req, res) => {
  try {
    const filter = req.query.company ? { company: req.query.company } : {};
    const data = await CompanyExpense.find(filter)
      .populate("company", "companyName location visitDate")
      .sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Approve or update expense
export const updateExpense = async (req, res) => {
  try {
    const updated = await CompanyExpense.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete expense record
export const deleteExpense = async (req, res) => {
  try {
    const deleted = await CompanyExpense.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Expense not found" });
    await VisitedCompany.findByIdAndUpdate(deleted.company, {
      $pull: { expenses: deleted._id },
    });
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
