import Gallery from "../models/galleryModel.js";
import cloudinary from "../config/cloudinary.js";

export const createGalleryPhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image required" });

    const photo = await Gallery.create({
      title: req.body.title,
      image: {
        url: req.file.path,
        public_id: req.file.filename,
      },
    });

    res.status(201).json(photo);
  } catch (err) {
    res.status(500).json({ message: "Failed to upload photo" });
  }
};

export const updateGalleryPhoto = async (req, res) => {
  try {
    const photo = await Gallery.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: "Not found" });

    if (req.file) {
      await cloudinary.uploader.destroy(photo.image.public_id);

      photo.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    photo.title = req.body.title || photo.title;
    await photo.save();

    res.json(photo);
  } catch (err) {
    res.status(500).json({ message: "Failed to update photo" });
  }
};
