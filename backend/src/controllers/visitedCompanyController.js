import VisitedCompany from "../models/visitedCompanyModel.js";
import cloudinary from "../config/cloudinary.js";

export const createVisitedCompany = async (req, res) => {
  try {
    const imageData = req.file
      ? {
          url: req.file.path,
          public_id: req.file.filename,
        }
      : null;

    const company = await VisitedCompany.create({
      ...req.body,
      branchList: Array.isArray(req.body.branchList)
        ? req.body.branchList
        : [req.body.branchList],
      image: imageData,
    });

    res.status(201).json(company);
  } catch (err) {
    res.status(500).json({ message: "Failed to create company" });
  }
};

export const updateVisitedCompany = async (req, res) => {
  try {
    const company = await VisitedCompany.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Not found" });

    if (req.file) {
      if (company.image?.public_id)
        await cloudinary.uploader.destroy(company.image.public_id);

      company.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    Object.assign(company, req.body);
    await company.save();

    res.json(company);
  } catch (err) {
    res.status(500).json({ message: "Failed to update company" });
  }
};

export const deleteVisitedCompany = async (req, res) => {
  try {
    const company = await VisitedCompany.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Not found" });

    if (company.image?.public_id)
      await cloudinary.uploader.destroy(company.image.public_id);

    await company.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete company" });
  }
};
