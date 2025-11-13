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
    image: {
      public_id: { type: String },
      url: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model("PlacedStudent", placedStudentSchema);
