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

  // ⭐ NEW: drag ordering field
  order: {
    type: Number,
    default: 0,
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
