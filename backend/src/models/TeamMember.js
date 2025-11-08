import mongoose from "mongoose";

const TeamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  department: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
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

export default mongoose.model("TeamMember", TeamMemberSchema);
