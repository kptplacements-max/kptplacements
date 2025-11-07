import VisitedCompany from "../models/visitedCompanyModel.js";
import "../models/companyExpenseModel.js";

// ✅ Create a new company visit
export const createVisitedCompany = async (req, res) => {
  try {
    const company = await VisitedCompany.create(req.body);
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all companies (with optional filters)
export const getAllVisitedCompanies = async (req, res) => {
  try {
    console.log("✅ Fetching visited companies with filters:", req.query);
    const { year, branch, company, location } = req.query;
    let query = {};

    if (year) {
      const start = new Date(`${year}-01-01`);
      const end = new Date(`${year}-12-31`);
      query.visitDate = { $gte: start, $lte: end };
    }
    if (branch) query.branchList = branch;
    if (company) query.companyName = new RegExp(company, "i");
    if (location) query.location = new RegExp(location, "i");

    const companies = await VisitedCompany.find(query)
      .populate("expenses")
      .sort({ visitDate: -1 });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get a single company by ID
export const getVisitedCompanyById = async (req, res) => {
  try {
    const company = await VisitedCompany.findById(req.params.id).populate(
      "expenses"
    );
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update company info
export const updateVisitedCompany = async (req, res) => {
  try {
    const updated = await VisitedCompany.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updated) return res.status(404).json({ message: "Company not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete company
export const deleteVisitedCompany = async (req, res) => {
  try {
    const deleted = await VisitedCompany.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Company not found" });
    res.json({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
