import Announcement from "../models/Announcement.js";

// ➕ Create a new announcement
export const createAnnouncement = async (req, res) => {
  try {
    const { title, description, department, date, link } = req.body;

    const announcement = new Announcement({
      title,
      description,
      department,
      date,
      link,
    });

    await announcement.save();
    res.status(201).json(announcement);
  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(500).json({ message: "Failed to create announcement" });
  }
};

// 📋 Get all announcements (sorted latest first)
export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ date: -1 });
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch announcements" });
  }
};

// 📄 Get single announcement by ID
export const getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ message: "Not found" });
    res.status(200).json(announcement);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch announcement" });
  }
};

// ✏️ Update an announcement
export const updateAnnouncement = async (req, res) => {
  try {
    const { title, description, department, date, link } = req.body;

    const updated = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title, description, department, date, link },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update announcement" });
  }
};

// ❌ Delete an announcement
export const deleteAnnouncement = async (req, res) => {
  try {
    const deleted = await Announcement.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "Announcement deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete announcement" });
  }
};
