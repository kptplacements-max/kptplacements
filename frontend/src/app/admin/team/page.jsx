"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TeamAdminPage() {
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    department: "",
    email: "",
    phone: "",
    image: null, // only used for File objects
  });
  const [preview, setPreview] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null); // existing uploaded image URL (when editing)
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const baseURL = process.env.NEXT_PUBLIC_API_URL || ""; // fallback

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/team`);
      setMembers(res.data);
    } catch (err) {
      console.error("Error fetching team members:", err);
      toast.error("Failed to load team members");
    }
  };

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // baseURL is stable; don't re-run unnecessarily

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
      setExistingImageUrl(null); // user selected a new file, forget the old preview
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      designation: "",
      department: "",
      email: "",
      phone: "",
      image: null,
    });
    setPreview(null);
    setExistingImageUrl(null);
    setEditingId(null);
    // clear file input visually
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("designation", formData.designation);
      data.append("department", formData.department || "");
      data.append("email", formData.email || "");
      data.append("phone", formData.phone || "");

      // Append image only if user selected a new file
      if (formData.image && formData.image instanceof File) {
        data.append("image", formData.image);
      }

      if (editingId) {
        // DO NOT set Content-Type manually — axios/browser will set the boundary
        await axios.put(`${baseURL}/api/team/${editingId}`, data);
        toast.success("Updated successfully!");
      } else {
        await axios.post(`${baseURL}/api/team`, data);
        toast.success("Added successfully!");
      }

      resetForm();
      fetchMembers();
    } catch (error) {
      console.error("Submit error:", error);
      // if server returns a message use it
      const errMsg = error?.response?.data?.message || "Something went wrong!";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this team member?")) return;
    try {
      await axios.delete(`${baseURL}/api/team/${id}`);
      toast.success("Deleted successfully!");
      fetchMembers();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete!");
    }
  };

  const handleEdit = (member) => {
    setEditingId(member._id);
    setFormData({
      name: member.name || "",
      designation: member.designation || "",
      department: member.department || "",
      email: member.email || "",
      phone: member.phone || "",
      image: null, // do not set the existing object here (we only store Files in this field)
    });
    setPreview(member.image?.url || null);
    setExistingImageUrl(member.image?.url || null);

    // clear the file input UI (so user doesn't see any leftover file)
    if (fileInputRef.current) fileInputRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 text-gray-700">
      {/* Include ToastContainer in this component if you don't have one globally */}
      <ToastContainer position="top-right" autoClose={2500} />

      <h1 className="text-2xl font-bold mb-6">
        {editingId ? "Edit Team Member" : "Add New Team Member"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border"
      >
        <FormField label="Name *" name="name" value={formData.name} onChange={handleChange} required />
        <FormField label="Designation *" name="designation" value={formData.designation} onChange={handleChange} required />
        <FormField label="Department" name="department" value={formData.department} onChange={handleChange} />
        <FormField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />
        <FormField label="Phone" name="phone" value={formData.phone} onChange={handleChange} />

        <div className="flex flex-col">
          <label className="font-medium mb-1">Profile Image</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border rounded-lg px-3 py-2 cursor-pointer file:px-3 file:bg-blue-600 file:text-white"
          />
          {/* show preview: prefer newly selected preview, otherwise existing image */}
          {preview ? (
            <img src={preview} alt="preview" className="w-24 h-24 object-cover rounded-lg mt-2 border" />
          ) : existingImageUrl ? (
            <img src={existingImageUrl} alt="existing" className="w-24 h-24 object-cover rounded-lg mt-2 border" />
          ) : null}
        </div>

        <div className="col-span-full flex justify-center mt-4">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow">
            {loading ? "Saving..." : editingId ? "Update Member" : "Add Member"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="ml-3 px-4 py-2 border rounded-lg"
          >
            Reset
          </button>
        </div>
      </form>

      <h2 className="text-xl font-semibold mt-10 mb-4">Team Members</h2>
      <div className="space-y-3">
        {members.map((member) => (
          <TeamCard key={member._id} member={member} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}

function FormField({ label, name, value, onChange, type = "text", required }) {
  return (
    <div className="flex flex-col">
      <label className="font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        required={required}
        onChange={onChange}
        className="border rounded-lg px-3 py-2"
      />
    </div>
  );
}

function TeamCard({ member, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-between bg-white shadow p-3 rounded border">
      <div className="flex items-center gap-4">
        <img src={member.image?.url || "/placeholder.jpg"} alt={member.name} className="w-16 h-16 object-cover rounded-full border" />
        <div>
          <h3 className="font-semibold">{member.name}</h3>
          <p className="text-sm text-gray-600">{member.designation}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onEdit(member)} className="bg-yellow-400 px-3 py-1 rounded">
          Edit
        </button>
        <button onClick={() => onDelete(member._id)} className="bg-red-500 text-white px-3 py-1 rounded">
          Delete
        </button>
      </div>
    </div>
  );
}
