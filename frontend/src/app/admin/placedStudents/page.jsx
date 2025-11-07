"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Plus, Save, Trash2, Edit2, X } from "lucide-react";

export default function PlacedStudentsManager() {
  const [students, setStudents] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [newRow, setNewRow] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/placed-students`;

  // Load all students
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(API_URL);
        setStudents(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch placed students");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle input change
  const handleChange = (i, field, value) => {
    const updated = [...students];
    updated[i][field] = value;
    setStudents(updated);
  };

  // Add new blank row
  const handleAddRow = () => {
    const emptyRow = {
      name: "",
      registerNumber: "",
      branch: "",
      yearOfPassing: "",
      companyName: "",
      location: "",
      packageOffered: "",
      designation: "",
      photoUrl: "",
    };
    setStudents([emptyRow, ...students]);
    setNewRow(true);
    setEditingRow(0);
  };

  // Save record
  const handleSave = async (i) => {
    const student = students[i];
    try {
      if (student._id) {
        await axios.put(`${API_URL}/${student._id}`, student);
        toast.success("Updated successfully!");
      } else {
        const res = await axios.post(API_URL, student);
        const updated = [...students];
        updated[i] = res.data;
        setStudents(updated);
        toast.success("Added new student!");
      }
      setEditingRow(null);
      setNewRow(false);
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    }
  };

  // Delete student
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setStudents(students.filter((s) => s._id !== id));
      toast.success("Deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  if (loading)
    return <p className="text-center py-10 text-gray-500">Loading data...</p>;

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-md overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-blue-800">
          Placed Students Management
        </h1>
        <button
          onClick={handleAddRow}
          className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
        >
          <Plus size={18} /> Add Student
        </button>
      </div>

      <table className="min-w-full text-xs md:text-sm border-collapse border border-gray-300">
        <thead className="bg-blue-800 text-white">
          <tr>
            {[
              "Photo",
              "Name",
              "Register No",
              "Branch",
              "Year of Passing",
              "Company Name",
              "Location",
              "Package (LPA)",
              "Designation",
              "Actions",
            ].map((h) => (
              <th key={h} className="border px-2 py-2 text-center">
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {students.map((s, i) => (
            <tr
              key={s._id || i}
              className={`text-center text-gray-700 ${
                i % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-blue-50 transition`}
            >
              {/* Photo */}
              <td className="border p-2">
                {editingRow === i ? (
                  <input
                    type="text"
                    value={s.photoUrl}
                    onChange={(e) =>
                      handleChange(i, "photoUrl", e.target.value)
                    }
                    className="border rounded w-28 text-xs"
                    placeholder="Photo URL"
                  />
                ) : s.photoUrl ? (
                  <img
                    src={s.photoUrl}
                    alt="photo"
                    className="w-12 h-12 object-cover rounded-full mx-auto"
                  />
                ) : (
                  <span className="text-gray-400">No Photo</span>
                )}
              </td>

              {/* Editable Fields */}
              {[
                "name",
                "registerNumber",
                "branch",
                "yearOfPassing",
                "companyName",
                "location",
                "packageOffered",
                "designation",
              ].map((field) => (
                <td key={field} className="border p-2">
                  {editingRow === i ? (
                    <input
                      type={
                        field === "yearOfPassing" || field === "packageOffered"
                          ? "number"
                          : "text"
                      }
                      value={s[field] ?? ""}
                      onChange={(e) => handleChange(i, field, e.target.value)}
                      className="border rounded w-full px-1 text-xs"
                    />
                  ) : (
                    s[field] || "-"
                  )}
                </td>
              ))}

              {/* Action Buttons */}
              <td className="border p-2">
                {editingRow === i ? (
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleSave(i)}
                      className="bg-green-600 p-1.5 rounded text-white hover:bg-green-700"
                    >
                      <Save size={16} />
                    </button>
                    <button
                      onClick={() => {
                        if (newRow) setStudents(students.slice(1));
                        setEditingRow(null);
                      }}
                      className="bg-gray-400 p-1.5 rounded text-white hover:bg-gray-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => setEditingRow(i)}
                      className="bg-blue-600 p-1.5 rounded text-white hover:bg-blue-700"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="bg-red-600 p-1.5 rounded text-white hover:bg-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {students.length === 0 && (
        <p className="text-center text-gray-500 py-6">
          No placed students found. Click “Add Student” to begin.
        </p>
      )}
    </div>
  );
}
