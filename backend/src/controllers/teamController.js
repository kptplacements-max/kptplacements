import TeamMember from "../models/TeamMember.js";
import cloudinary from "../config/cloudinary.js";

// Create new team member
export const createMember = async (req, res) => {
  try {
    const { name, designation, department, email, phone } = req.body;
    const file = req.file;

    let uploadedImage = null;
    if (file) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "team_members",
      });
      uploadedImage = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    const member = new TeamMember({
      name,
      designation,
      department,
      email,
      phone,
      image: uploadedImage,
    });

    await member.save();
    res.status(201).json(member);
  } catch (error) {
    console.error("Error creating team member:", error);
    res.status(500).json({ message: "Failed to create team member" });
  }
};

// Get all members
export const getMembers = async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ createdAt: -1 });
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch team members" });
  }
};

// Get single member
export const getMemberById = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });
    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch team member" });
  }
};

// Update member
// Update member
export const updateMember = async (req, res) => {
  try {
    const { name, designation, department, email, phone } = req.body;
    const file = req.file;
    const member = await TeamMember.findById(req.params.id);

    if (!member) return res.status(404).json({ message: "Member not found" });

    // If a new file is uploaded: upload new image first, then remove old image
    if (file) {
      // Upload new image
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "team_members",
      });

      // store old public_id to delete after successful upload
      const oldPublicId = member.image?.public_id;

      member.image = {
        public_id: result.public_id,
        url: result.secure_url,
      };

      // delete old image only after successful new upload
      if (oldPublicId) {
        try {
          await cloudinary.uploader.destroy(oldPublicId);
        } catch (err) {
          // log and continue, don't fail the whole update
          console.warn("Failed to delete old cloudinary image:", err);
        }
      }
    }

    // update other fields
    member.name = name || member.name;
    member.designation = designation || member.designation;
    member.department = department || member.department;
    member.email = email || member.email;
    member.phone = phone || member.phone;

    const updated = await member.save();
    res.status(200).json(updated);
  } catch (error) {
    console.error("Update member error:", error);
    res.status(500).json({ message: "Failed to update member" });
  }
};


// Delete member
export const deleteMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    // Delete image from Cloudinary
    if (member.image?.public_id) {
      await cloudinary.uploader.destroy(member.image.public_id);
    }

    await member.deleteOne();
    res.status(200).json({ message: "Team member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete member" });
  }
};
