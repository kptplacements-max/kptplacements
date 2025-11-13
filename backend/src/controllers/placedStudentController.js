import PlacedStudent from "../models/placedStudentModel.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// ✅ Create Placed Student with image upload
export const createPlacedStudent = async (req, res) => {
  try {
    const {
      name,
      registerNumber,
      branch,
      yearOfPassing,
      companyName,
      location,
      packageOffered,
      designation,
    } = req.body;

    if (!req.file)
      return res.status(400).json({ message: "Image is required" });

    // Upload image to Cloudinary
    const upload = await cloudinary.uploader.upload(req.file.path, {
      folder: "kpt_placed_students",
    });

    // Delete local temp file
    fs.unlinkSync(req.file.path);

    const student = await PlacedStudent.create({
      name,
      registerNumber,
      branch,
      yearOfPassing,
      companyName,
      location,
      packageOffered,
      designation,
      image: {
        public_id: upload.public_id,
        url: upload.secure_url,
      },
    });

    res.status(201).json(student);
  } catch (err) {
    console.error("Error creating student:", err);
    res.status(500).json({ message: "Failed to create student" });
  }
};

// ✅ Get all students
export const getAllPlacedStudents = async (req, res) => {
  try {
    const students = await PlacedStudent.find().sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

// ✅ Delete student
export const deletePlacedStudent = async (req, res) => {
  try {
    const student = await PlacedStudent.findById(req.params.id);
    if (!student)
      return res.status(404).json({ message: "Student not found" });

    if (student.image?.public_id) {
      await cloudinary.uploader.destroy(student.image.public_id);
    }

    await student.deleteOne();
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete student" });
  }
};

// ✅ Update placed student (optional)
export const updatePlacedStudent = async (req, res) => {
  try {
    const student = await PlacedStudent.findById(req.params.id);
    if (!student)
      return res.status(404).json({ message: "Student not found" });

    const {
      name,
      registerNumber,
      branch,
      yearOfPassing,
      companyName,
      location,
      packageOffered,
      designation,
    } = req.body;

    // If new image uploaded, replace old
    if (req.file) {
      if (student.image?.public_id) {
        await cloudinary.uploader.destroy(student.image.public_id);
      }

      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "kpt_placed_students",
      });

      fs.unlinkSync(req.file.path);
      student.image = { public_id: upload.public_id, url: upload.secure_url };
    }

    // Update text fields
    student.name = name || student.name;
    student.registerNumber = registerNumber || student.registerNumber;
    student.branch = branch || student.branch;
    student.yearOfPassing = yearOfPassing || student.yearOfPassing;
    student.companyName = companyName || student.companyName;
    student.location = location || student.location;
    student.packageOffered = packageOffered || student.packageOffered;
    student.designation = designation || student.designation;

    await student.save();
    res.status(200).json(student);
  } catch (err) {
    console.error("Error updating student:", err);
    res.status(500).json({ message: "Failed to update student" });
  }
};
