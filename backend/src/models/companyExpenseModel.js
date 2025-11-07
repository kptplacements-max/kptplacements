import mongoose from "mongoose";

const companyExpenseSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VisitedCompany",
      required: true,
    },
    submittedBy: { type: String, required: true },

    initialAmount: { type: Number, default: 5000 },
    totalAmount: { type: Number, default: 0 },
    availableBalance: { type: Number, default: 5000 },

    items: [
      {
        description: { type: String, required: true },
        amount: { type: Number, required: true },
      },
    ],

    approvedByOfficer: { type: Boolean, default: false },
    approvedByPrincipal: { type: Boolean, default: false },
    approvalRemarks: { type: String },

    status: {
      type: String,
      enum: ["Pending", "Officer Approved", "Principal Approved", "Rejected"],
      default: "Pending",
    },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Auto calculate total & balance before save
companyExpenseSchema.pre("save", function (next) {
  this.totalAmount = this.items.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );
  this.availableBalance = (this.initialAmount || 0) - this.totalAmount;

  // Update status dynamically
  if (this.approvedByPrincipal) this.status = "Principal Approved";
  else if (this.approvedByOfficer) this.status = "Officer Approved";
  else this.status = "Pending";

  next();
});

export default mongoose.model("CompanyExpense", companyExpenseSchema);
