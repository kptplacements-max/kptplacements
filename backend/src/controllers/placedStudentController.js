import PlacedStudent from "../models/placedStudentModel.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// ✅ Create Placed Student with image upload
export const createPlacedStudent = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image required" });

    const student = await PlacedStudent.create({
      ...req.body,
      image: {
        url: req.file.path,
        public_id: req.file.filename,
      },
    });

    res.status(201).json(student);
  } catch {
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
    if (!student) return res.status(404).json({ message: "Not found" });

    if (req.file) {
      await cloudinary.uploader.destroy(student.image.public_id);
      student.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    Object.assign(student, req.body);
    await student.save();

    res.json(student);
  } catch {
    res.status(500).json({ message: "Failed to update student" });
  }
};