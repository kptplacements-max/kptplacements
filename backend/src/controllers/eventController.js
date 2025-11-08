import Event from "../models/eventModel.js";
import cloudinary from "../config/cloudinary.js";

// Create Event
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      eventDate,
      conductedBy,
      targetAudience,
    } = req.body;
    const file = req.file; // from multer

    let uploadedImage = null;
    if (file) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "kpt_events",
      });
      uploadedImage = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    const event = new Event({
      title,
      category,
      description,
      eventDate,
      conductedBy,
      targetAudience,
      image: uploadedImage,
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create event" });
  }
};

// Get All Events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ eventDate: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

// Get Single Event
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch event" });
  }
};

// Update Event
export const updateEvent = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      eventDate,
      conductedBy,
      targetAudience,
    } = req.body;
    const file = req.file;
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: "Event not found" });

    // If a new image is uploaded, delete old one from Cloudinary
    if (file && event.image?.public_id) {
      await cloudinary.uploader.destroy(event.image.public_id);
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "kpt_events",
      });
      event.image = { public_id: result.public_id, url: result.secure_url };
    }

    event.title = title || event.title;
    event.category = category || event.category;
    event.description = description || event.description;
    event.eventDate = eventDate || event.eventDate;
    event.conductedBy = conductedBy || event.conductedBy;
    event.targetAudience = targetAudience || event.targetAudience;

    const updatedEvent = await event.save();
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update event" });
  }
};

// Delete Event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Delete Cloudinary image
    if (event.image?.public_id) {
      await cloudinary.uploader.destroy(event.image.public_id);
    }

    await event.deleteOne();
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete event" });
  }
};
