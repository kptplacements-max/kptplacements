import mongoose from "mongoose";

const placedStudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    registerNumber: { type: String, required: true, unique: true },
    branch: { type: String, required: true },
    yearOfPassing: { type: Number, required: true },

    companyName: { type: String, required: true },
    location: { type: String, required: true },
    packageOffered: { type: Number, required: true },
    designation: { type: String },

    photoUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("PlacedStudent", placedStudentSchema);
