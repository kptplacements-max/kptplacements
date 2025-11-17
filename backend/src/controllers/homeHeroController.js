import HomeHero from "../models/homeHeroModel.js";
import cloudinary from "../config/cloudinary.js";

// ✅ Upload hero image
export const uploadHeroImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image required" });

    const img = await HomeHero.create({
      image: {
        url: req.file.path,
        public_id: req.file.filename,
      },
    });

    res.status(201).json(img);
  } catch {
    res.status(500).json({ message: "Failed to upload" });
  }
};


// ✅ Get all hero images
export const getHeroImages = async (req, res) => {
  try {
    const images = await HomeHero.find().sort({ uploadedAt: -1 });
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch hero images" });
  }
};

// ✅ Delete hero image
export const deleteHeroImage = async (req, res) => {
  try {
    const image = await HomeHero.findById(req.params.id);
    if (!image) return res.status(404).json({ message: "Image not found" });

    if (image.image?.public_id) {
      await cloudinary.uploader.destroy(image.image.public_id);
    }

    await image.deleteOne();
    res.status(200).json({ message: "Hero image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete hero image" });
  }
};
