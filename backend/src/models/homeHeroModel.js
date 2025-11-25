import mongoose from "mongoose";

const HomeHeroSchema = new mongoose.Schema({
  image: {
    public_id: { type: String },
    url: { type: String },
  },
  order: {
    type: Number,
    default: 0,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});


export default mongoose.model("HomeHero", HomeHeroSchema);
