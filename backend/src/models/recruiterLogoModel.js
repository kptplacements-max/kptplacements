import mongoose from "mongoose";

const RecruiterLogoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    public_id: { type: String },
    url: { type: String },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("RecruiterLogo", RecruiterLogoSchema);
