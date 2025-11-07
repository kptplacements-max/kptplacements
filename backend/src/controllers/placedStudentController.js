import PlacedStudent from "../models/placedStudentModel.js";

// ✅ Create new placed student
export const createPlacedStudent = async (req, res) => {
  try {
    const newStudent = await PlacedStudent.create(req.body);
    res.status(201).json(newStudent);
  } catch (err) {
    console.error("Error creating placed student:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all students (with filters)
export const getAllPlacedStudents = async (req, res) => {
  try {
    const { year, branch, company } = req.query;
    const filter = {};

    if (year) filter.yearOfPassing = year;
    if (branch) filter.branch = new RegExp(branch, "i");
    if (company) filter.companyName = new RegExp(company, "i");

    const students = await PlacedStudent.find(filter).sort({
      yearOfPassing: -1,
      name: 1,
    });

    res.json(students);
  } catch (err) {
    console.error("Error fetching placed students:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get single student by ID
export const getPlacedStudentById = async (req, res) => {
  try {
    const student = await PlacedStudent.findById(req.params.id);
    if (!student)
      return res.status(404).json({ message: "Placed student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update student details
export const updatePlacedStudent = async (req, res) => {
  try {
    const updated = await PlacedStudent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated)
      return res.status(404).json({ message: "Placed student not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete student
export const deletePlacedStudent = async (req, res) => {
  try {
    const deleted = await PlacedStudent.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Placed student not found" });
    res.json({ message: "Placed student deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
