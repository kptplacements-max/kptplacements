import mongoose from "mongoose";

const companyExpenseSchema = new mongoose.Schema(
  {
    // 🟢 Now optional
    company: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "VisitedCompany",
  default: null,
  required: false,
},


    // 🟢 New field for "OTHER" category
    otherCategory: {
      type: String,
      default: null,
    },

    submittedBy: { type: String, required: true },

    totalAmount: { type: Number, default: 0 },

    items: [
      {
        description: { type: String, required: true },
        amount: { type: Number, required: true },
      },
    ],

    approvedByOfficer: { type: Boolean, default: false },
    approvedByPrincipal: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["Pending", "Officer Approved", "Principal Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

// Auto calculate total before save
companyExpenseSchema.pre("save", function (next) {
  this.totalAmount = this.items.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );

  if (this.approvedByPrincipal) this.status = "Principal Approved";
  else if (this.approvedByOfficer) this.status = "Officer Approved";
  else this.status = "Pending";

  next();
});

export default mongoose.model("CompanyExpense", companyExpenseSchema);
