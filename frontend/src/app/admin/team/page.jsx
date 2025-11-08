"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function TeamAdminPage() {
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    department: "",
    email: "",
    phone: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  // ✅ Fetch all team members
  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/team`);
      setMembers(res.data);
    } catch (err) {
      console.error("Error fetching team members:", err);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [baseURL]);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle image file + preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file)); // instant preview
    }
  };

  // ✅ Submit (create / update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key]);
    });

    try {
      if (editingId) {
        await axios.put(`${baseURL}/api/team/${editingId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Team member updated!");
      } else {
        await axios.post(`${baseURL}/api/team`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Team member added!");
      }

      setFormData({
        name: "",
        designation: "",
        department: "",
        email: "",
        phone: "",
        image: null,
      });
      setPreview(null);
      setEditingId(null);
      fetchMembers();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  // ✅ Delete member
  const handleDelete = async (id) => {
    if (confirm("Delete this team member?")) {
      try {
        await axios.delete(`${baseURL}/api/team/${id}`);
        toast.info("Team member deleted.");
        fetchMembers();
      } catch (error) {
        console.error(error);
      }
    }
  };

  // ✅ Edit member
  const handleEdit = (member) => {
    setEditingId(member._id);
    setFormData({
      name: member.name,
      designation: member.designation,
      department: member.department,
      email: member.email,
      phone: member.phone,
      image: null,
    });
    setPreview(member.image?.url || null);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 text-gray-700">
      <h1 className="text-2xl font-bold mb-6">
        {editingId ? "Edit Team Member" : "Add New Team Member"}
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-200"
      >
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">
            Designation *
          </label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">
            Profile Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border border-gray-300 rounded-lg px-3 py-2 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-lg mt-2 border"
            />
          )}
        </div>

        <div className="col-span-full flex justify-center mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            {editingId ? "Update Member" : "Add Member"}
          </button>
        </div>
      </form>

      {/* TEAM LIST */}
      <h2 className="text-xl font-semibold mt-10 mb-4">Team Members</h2>
      <div className="space-y-3">
        {members.map((member) => (
          <div
            key={member._id}
            className="flex items-center justify-between bg-white shadow p-3 rounded border border-gray-200"
          >
            <div className="flex items-center gap-4">
              <img
                src={member.image?.url || "/placeholder.jpg"}
                alt={member.name}
                className="w-16 h-16 object-cover rounded-full border"
              />
              <div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.designation}</p>
                <p className="text-xs text-gray-500">{member.department}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(member)}
                className="bg-yellow-400 text-gray-900 px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(member._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
