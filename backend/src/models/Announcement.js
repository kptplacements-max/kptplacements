import mongoose from "mongoose";

const AnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  department: {
    type: String,
    default: "All Departments",
  },
  date: {
    type: Date,
    required: true,
  },
  link: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Announcement", AnnouncementSchema);
