import VisitedCompany from "../models/visitedCompanyModel.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import CompanyExpense from "../models/companyExpenseModel.js";


// ========================================================
//  CREATE COMPANY VISIT (with image upload)
// ========================================================
export const createVisitedCompany = async (req, res) => {
  try {
    let imageUrl = "";

    // Upload new image if provided
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "kpt_visited_companies",
      });

      fs.unlinkSync(req.file.path);
      imageUrl = upload.secure_url;
    }

   const company = await VisitedCompany.create({
  ...req.body,
  branchList: Array.isArray(req.body.branchList)
    ? req.body.branchList
    : [req.body.branchList],
  imageUrl,
});


    res.status(201).json(company);
  } catch (err) {
    console.error("Error creating visited company:", err);
    res.status(500).json({ message: "Failed to create company" });
  }
};

// ========================================================
//  GET ALL COMPANIES
// ========================================================
// ========================================================
//  GET ALL COMPANIES (SAFE VERSION - NO CRASH)
// ========================================================
export const getAllVisitedCompanies = async (req, res) => {
  try {
    let companies = await VisitedCompany.find()
      .populate("expenses")
      .sort({ createdAt: -1 });

    // FIX BROKEN DATA FROM OLD ENTRIES
    const cleanCompanies = companies.map((c) => ({
      ...c._doc,
      branchList: Array.isArray(c.branchList) ? c.branchList : [],
      visitDate: c.visitDate ? c.visitDate : new Date(),
      location: c.location || "",
      companyName: c.companyName || "",
      packageOffered: c.packageOffered || 0,
      studentsRecruited: c.studentsRecruited || 0,
    }));

    return res.json(cleanCompanies);
  } catch (err) {
    console.error("Error in GET all companies:", err);
    res.status(500).json({ message: "Failed to load visited companies" });
  }
};

// ========================================================
//  GET SINGLE COMPANY
// ========================================================
export const getVisitedCompanyById = async (req, res) => {
  try {
    const company = await VisitedCompany.findById(req.params.id).populate(
      "expenses"
    );
    if (!company)
      return res.status(404).json({ message: "Company not found" });

    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================================================
//  UPDATE COMPANY (with optional new image)
// ========================================================
export const updateVisitedCompany = async (req, res) => {
  try {
    const company = await VisitedCompany.findById(req.params.id);
    if (!company)
      return res.status(404).json({ message: "Company not found" });

    // Upload new image if provided
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "kpt_visited_companies",
      });

      fs.unlinkSync(req.file.path);
      company.imageUrl = upload.secure_url;
    }

    // Update text values
    Object.assign(company, req.body);

    const updated = await company.save();
    res.json(updated);
  } catch (err) {
    console.error("Error updating visited company:", err);
    res.status(500).json({ message: "Failed to update company" });
  }
};

// ========================================================
//  DELETE COMPANY (also delete image if stored in Cloudinary)
// ========================================================
export const deleteVisitedCompany = async (req, res) => {
  try {
    const company = await VisitedCompany.findById(req.params.id);
    if (!company)
      return res.status(404).json({ message: "Company not found" });

    // ❌ Remove image from Cloudinary (optional – only if needed)
    if (company.imageUrl) {
      const publicId = company.imageUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`kpt_visited_companies/${publicId}`);
    }

    await company.deleteOne();
    res.json({ message: "Company deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete company" });
  }
};
