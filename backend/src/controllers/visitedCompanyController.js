import VisitedCompany from "../models/visitedCompanyModel.js";
import cloudinary from "../config/cloudinary.js";

// ========================================================
//  CREATE COMPANY
// ========================================================
export const createVisitedCompany = async (req, res) => {
  try {
    let uploadedImage = "";

    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "kpt_placements/visited_companies",
      });
      uploadedImage = upload.secure_url;
    }

    const company = await VisitedCompany.create({
      ...req.body,
      branchList: Array.isArray(req.body.branchList)
        ? req.body.branchList
        : [req.body.branchList],
      imageUrl: uploadedImage,
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
export const getAllVisitedCompanies = async (req, res) => {
  try {
    const companies = await VisitedCompany.find().sort({ createdAt: -1 });
    res.json(companies);
  } catch (err) {
    console.error("Error in GET all companies:", err);
    res.status(500).json({ message: "Failed to load companies" });
  }
};

// ========================================================
//  GET COMPANY BY ID
// ========================================================
export const getVisitedCompanyById = async (req, res) => {
  try {
    const company = await VisitedCompany.findById(req.params.id);
    if (!company)
      return res.status(404).json({ message: "Company not found" });

    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================================================
//  UPDATE COMPANY
// ========================================================
export const updateVisitedCompany = async (req, res) => {
  try {
    const company = await VisitedCompany.findById(req.params.id);
    if (!company)
      return res.status(404).json({ message: "Company not found" });

    // If new file uploaded → upload to cloudinary
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "kpt_placements/visited_companies",
      });

      company.imageUrl = upload.secure_url;
    }

    Object.assign(company, req.body);
    const updated = await company.save();

    res.json(updated);
  } catch (err) {
    console.error("Error updating company:", err);
    res.status(500).json({ message: "Failed to update company" });
  }
};

// ========================================================
//  DELETE COMPANY
// ========================================================
export const deleteVisitedCompany = async (req, res) => {
  try {
    const company = await VisitedCompany.findById(req.params.id);
    if (!company)
      return res.status(404).json({ message: "Company not found" });

    // Delete cloudinary image
    if (company.imageUrl) {
      const publicId = company.imageUrl.split("/").slice(-1)[0].split(".")[0];
      await cloudinary.uploader.destroy(
        `kpt_placements/visited_companies/${publicId}`
      );
    }

    await company.deleteOne();
    res.json({ message: "Company deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Failed to delete company" });
  }
};
