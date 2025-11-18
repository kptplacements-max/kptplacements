// config/cloudinaryStorage.js

import cloudinary from "./cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "kpt_placements",
    allowedFormats: ["jpg", "jpeg", "png", "webp"], // FIXED
    transformation: [{ quality: "auto" }],
  },
});

export default storage;
