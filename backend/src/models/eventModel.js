import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: [
      "Training",
      "Workshop",
      "Industry Visit",
      "Placement Drive",
      "Seminar",
      "Guest Lecture",
      "Other",
    ],
    default: "Other",
  },
  description: {
    type: String,
    required: true,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  conductedBy: {
    type: String,
  },
  targetAudience: {
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

export default mongoose.model("Event", EventSchema);
