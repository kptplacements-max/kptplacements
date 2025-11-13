import RecruiterLogo from "../models/recruiterLogoModel.js";
import cloudinary from "../config/cloudinary.js";

// ✅ Create Recruiter Logo
export const createRecruiterLogo = async (req, res) => {
  try {
    const { name } = req.body;
    const file = req.file;

    if (!name) return res.status(400).json({ message: "Name required" });
    if (!file) return res.status(400).json({ message: "Image required" });

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "kpt_recruiter_logos",
    });

    const recruiterLogo = new RecruiterLogo({
      name,
      image: { public_id: result.public_id, url: result.secure_url },
    });

    await recruiterLogo.save();
    res.status(201).json(recruiterLogo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create recruiter logo" });
  }
};

// ✅ Get All Recruiter Logos
export const getRecruiterLogos = async (req, res) => {
  try {
    const logos = await RecruiterLogo.find().sort({ createdAt: -1 });
    res.status(200).json(logos);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recruiter logos" });
  }
};

// ✅ Delete Logo
export const deleteRecruiterLogo = async (req, res) => {
  try {
    const logo = await RecruiterLogo.findById(req.params.id);
    if (!logo) return res.status(404).json({ message: "Not found" });

    if (logo.image?.public_id) {
      await cloudinary.uploader.destroy(logo.image.public_id);
    }

    await logo.deleteOne();
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete recruiter logo" });
  }
};
// ✅ Update Recruiter Logo
export const updateRecruiterLogo = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const logo = await RecruiterLogo.findById(id);
    if (!logo) return res.status(404).json({ message: "Logo not found" });

    // If a new image is uploaded, replace the old one
    if (req.file) {
      // Delete old image from Cloudinary
      if (logo.image?.public_id) {
        await cloudinary.uploader.destroy(logo.image.public_id);
      }

      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "kpt_recruiter_logos",
      });

      logo.image = { public_id: result.public_id, url: result.secure_url };
    }

    // Update name (if changed)
    if (name) logo.name = name;

    await logo.save();
    res.status(200).json({ message: "Logo updated successfully", logo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update recruiter logo" });
  }
};
