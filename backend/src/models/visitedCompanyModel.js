import mongoose from "mongoose";

const visitedCompanySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    branchList: [{ type: String, required: true }],
    location: { type: String, required: true },
    packageOffered: { type: Number, required: true },
    visitDate: { type: Date, required: true },

    image: {
      url: { type: String },
      public_id: { type: String },
    },

    studentsRecruited: { type: Number, default: 0 },

    modeOfVisit: {
      type: String,
      enum: ["On-campus", "Pool", "Online"],
      default: "On-campus",
    },

    recruitmentType: {
      type: String,
      enum: ["Placement", "Internship", "Both Internship and Placement"],
      default: "Placement",
    },

    expenses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CompanyExpense",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("VisitedCompany", visitedCompanySchema);
