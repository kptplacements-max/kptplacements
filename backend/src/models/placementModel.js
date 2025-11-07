import mongoose from "mongoose";

const programSchema = new mongoose.Schema({
  program: { type: String, required: true },

  // Total Student Strength
  male: { type: Number, default: 0 },
  female: { type: Number, default: 0 },
  total: { type: Number, default: 0 },

  // ✅ Total Students Passed
  passedMale: { type: Number, default: 0 },
  passedFemale: { type: Number, default: 0 },
  passedTotal: { type: Number, default: 0 },

  // Total Students Placed
  placedMale: { type: Number, default: 0 },
  placedFemale: { type: Number, default: 0 },
  placedTotal: { type: Number, default: 0 },

  // Opted for Higher Studies
  higherMale: { type: Number, default: 0 },
  higherFemale: { type: Number, default: 0 },
  higherTotal: { type: Number, default: 0 },

  // Dropouts / Backlogs
  dropoutMale: { type: Number, default: 0 },
  dropoutFemale: { type: Number, default: 0 },
  dropoutTotal: { type: Number, default: 0 },

  // Entrepreneurs
  entrepreneurMale: { type: Number, default: 0 },
  entrepreneurFemale: { type: Number, default: 0 },

  // Placement % by Gender
  percentageMale: { type: Number, default: 0 },
  percentageFemale: { type: Number, default: 0 },
  percentageTotal: { type: Number, default: 0 },
});

const placementSchema = new mongoose.Schema(
  {
    year: { type: Number, required: true, unique: true },
    programs: [programSchema],

    // Year-wise totals
    totalStudents: { type: Number, default: 0 },
    totalPassed: { type: Number, default: 0 },
    totalPlaced: { type: Number, default: 0 },
    totalHigherStudies: { type: Number, default: 0 },
    totalEntrepreneurs: { type: Number, default: 0 },
    overallPercentage: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Placement", placementSchema);
