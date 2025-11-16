import Gallery from "../models/galleryModel.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const createGalleryPhoto = async (req, res) => {
  try {
    const { title } = req.body;

    if (!req.file)
      return res.status(400).json({ message: "Image is required" });

    const uploaded = await cloudinary.uploader.upload(req.file.path, {
      folder: "kpt_gallery",
    });

    fs.unlinkSync(req.file.path);

    const photo = await Gallery.create({
      title,
      image: { public_id: uploaded.public_id, url: uploaded.secure_url },
    });

    res.status(201).json(photo);
  } catch (error) {
    res.status(500).json({ message: "Failed to upload photo" });
  }
};

export const getAllGalleryPhotos = async (req, res) => {
  const photos = await Gallery.find().sort({ createdAt: -1 });
  res.status(200).json(photos);
};

export const deleteGalleryPhoto = async (req, res) => {
  const photo = await Gallery.findById(req.params.id);
  if (!photo) return res.status(404).json({ message: "Not found" });

  await cloudinary.uploader.destroy(photo.image.public_id);
  await photo.deleteOne();

  res.status(200).json({ message: "Deleted" });
};

export const updateGalleryPhoto = async (req, res) => {
  const photo = await Gallery.findById(req.params.id);
  if (!photo) return res.status(404).json({ message: "Not found" });

  photo.title = req.body.title || photo.title;

  if (req.file) {
    await cloudinary.uploader.destroy(photo.image.public_id);

    const uploaded = await cloudinary.uploader.upload(req.file.path, {
      folder: "kpt_gallery",
    });

    fs.unlinkSync(req.file.path);

    photo.image = {
      public_id: uploaded.public_id,
      url: uploaded.secure_url,
    };
  }

  await photo.save();
  res.status(200).json(photo);
};
