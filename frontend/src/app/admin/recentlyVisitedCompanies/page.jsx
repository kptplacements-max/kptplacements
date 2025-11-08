"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import CompanyExpensesModal from "../expenses/page";

const API = process.env.NEXT_PUBLIC_API_URL;
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

async function uploadToCloudinary(file) {
  if (!file) return null;
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", UPLOAD_PRESET);
  const res = await fetch(url, { method: "POST", body: fd });
  const data = await res.json();

  return data.secure_url;
}

export default function VisitedCompanyManager() {
  const { user } = useUser();
  const role = user?.publicMetadata?.role;
  const isCoordinator = role === "placement-coordinator";

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters & UI
  const [filters, setFilters] = useState({
    branch: "",
    company: "",
    location: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    companyName: "",
    branchList: [],
    location: "",
    packageOffered: "",
    visitDate: "",
    imageUrl: "",
    studentsRecruited: 0,
    modeOfVisit: "On-campus",
    recruitmentType: "Placement",
  });

  const [selectedCompanyForExpenses, setSelectedCompanyForExpenses] =
    useState(null);

  useEffect(() => {
    fetchCompanies();
    // eslint-disable-next-line
  }, []);

  const [uploading, setUploading] = useState(false);

  async function handleImageFileChoose(file) {
    try {
      setUploading(true);
      const url = await uploadToCloudinary(file);
      if (url) {
        setForm((f) => ({ ...f, imageUrl: url }));
        console.log("✅ Image uploaded:", url);
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function fetchCompanies() {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/visited-companies`, {
        params: {},
      });
      console.log(res.data);
      setCompanies(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load companies");
    } finally {
      setLoading(false);
    }
  }

  function applyFilters(list) {
    return list.filter((c) => {
      if (
        filters.branch &&
        !c.branchList.some((b) =>
          b.toLowerCase().includes(filters.branch.toLowerCase())
        )
      )
        return false;
      if (
        filters.company &&
        !c.companyName.toLowerCase().includes(filters.company.toLowerCase())
      )
        return false;
      if (
        filters.location &&
        !c.location.toLowerCase().includes(filters.location.toLowerCase())
      )
        return false;
      return true;
    });
  }

  function openNewForm() {
    setEditing(null);
    setForm({
      companyName: "",
      branchList: [],
      location: "",
      packageOffered: "",
      visitDate: "",
      imageUrl: "",
      studentsRecruited: 0,
      modeOfVisit: "On-campus",
      recruitmentType: "Placement",
    });
    setShowForm(true);
  }

  function openEdit(company) {
    setEditing(company);
    setForm({
      companyName: company.companyName || "",
      branchList: company.branchList || [],
      location: company.location || "",
      packageOffered: company.packageOffered || "",
      visitDate: company.visitDate
        ? new Date(company.visitDate).toISOString().slice(0, 10)
        : "",
      imageUrl: company.imageUrl || "",
      studentsRecruited: company.studentsRecruited || 0,
      modeOfVisit: company.modeOfVisit || "On-campus",
      recruitmentType: company.recruitmentType || "Placement",
    });
    setShowForm(true);
  }

  function handleFormChange(field, value) {
    if (field === "branchList") {
      const arr = value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      setForm((f) => ({ ...f, branchList: arr }));
    } else setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleImageFileChoose(file) {
    try {
      const url = await uploadToCloudinary(file);
      if (url) setForm((f) => ({ ...f, imageUrl: url }));
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  }

  async function saveForm() {
    try {
      console.log("🧾 Saving form payload:", form); // <--- ADD THIS
      const payload = {
        ...form,
        packageOffered: Number(form.packageOffered) || 0,
        studentsRecruited: Number(form.studentsRecruited) || 0,
        visitDate: new Date(form.visitDate),
      };
      if (editing) {
        await axios.put(`${API}/api/visited-companies/${editing._id}`, payload);
        alert("Updated");
      } else {
        await axios.post(`${API}/api/visited-companies`, payload);
        alert("Created");
      }
      setShowForm(false);
      fetchCompanies();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  }

  async function deleteCompany(id) {
    if (!confirm("Delete this company visit?")) return;
    try {
      await axios.delete(`${API}/api/visited-companies/${id}`);
      fetchCompanies();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }

  return (
    <div className="p-6 text-gray-600">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Recently Visited Companies</h2>
        <div className="flex gap-2">
          <input
            placeholder="Branch"
            value={filters.branch}
            onChange={(e) =>
              setFilters((s) => ({ ...s, branch: e.target.value }))
            }
            className="border px-2 py-1 rounded"
          />
          <input
            placeholder="Company"
            value={filters.company}
            onChange={(e) =>
              setFilters((s) => ({ ...s, company: e.target.value }))
            }
            className="border px-2 py-1 rounded"
          />
          <input
            placeholder="Location"
            value={filters.location}
            onChange={(e) =>
              setFilters((s) => ({ ...s, location: e.target.value }))
            }
            className="border px-2 py-1 rounded"
          />
          <button
            onClick={() =>
              setFilters({ branch: "", company: "", location: "" })
            }
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Clear
          </button>
          {isCoordinator && (
            <button
              onClick={openNewForm}
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Add 
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {applyFilters(companies).map((c) => (
            <div
              key={c._id}
              className="bg-white p-4 rounded-lg shadow flex gap-4"
            >
              <img
                src={c.imageUrl || "/visited-company-placeholder.png"}
                alt={c.companyName}
                className="w-28 h-28 object-cover rounded-md"
                onError={(e) => (e.currentTarget.src = "/placeholder-150.png")}
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{c.companyName}</h3>
                    <div className="text-sm text-gray-600">
                      {c.branchList?.join(", ")} • {c.location}
                    </div>
                    <div className="text-sm text-gray-700 mt-2">
                      Package: <strong>{c.packageOffered} LPA</strong>
                      {" • "}Visited:{" "}
                      {new Date(c.visitDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-700 mt-1">
                      Students recruited: <strong>{c.studentsRecruited}</strong>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {c.modeOfVisit} • {c.recruitmentType}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setSelectedCompanyForExpenses(c)}
                      className="px-2 py-1 bg-emerald-600 text-white rounded text-sm"
                    >
                      Expenses
                    </button>

                    {isCoordinator ? (
                      <>
                        <button
                          onClick={() => openEdit(c)}
                          className="px-2 py-1 bg-yellow-400 rounded text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteCompany(c._id)}
                          className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                        >
                          Delete
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative bg-gradient-to-b from-blue-50 via-white to-blue-100 rounded-2xl w-full max-w-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh] border border-blue-100">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                {editing ? "✏️ Edit" : "➕ Add"} Company Visit
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-red-500 hover:text-red-700 text-lg font-semibold"
              >
                ✖
              </button>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Company Name */}
              <div>
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
                  <span className="text-blue-700">🏢</span> Company Name
                </label>
                <input
                  value={form.companyName}
                  onChange={(e) =>
                    handleFormChange("companyName", e.target.value)
                  }
                  placeholder="e.g. Infosys Ltd."
                  className="border border-gray-300 p-2 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Branch List */}
              <div>
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
                  <span className="text-green-700">🧑‍💻</span> Branches
                  (comma-separated)
                </label>
                <input
                  value={form.branchList.join(", ")}
                  onChange={(e) =>
                    handleFormChange("branchList", e.target.value)
                  }
                  placeholder="CSE, ECE, ME, CIVIL"
                  className="border border-gray-300 p-2 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Location */}
              <div>
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
                  <span className="text-purple-700">📍</span> Location
                </label>
                <input
                  value={form.location}
                  onChange={(e) => handleFormChange("location", e.target.value)}
                  placeholder="e.g. Bengaluru"
                  className="border border-gray-300 p-2 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Package */}
              <div>
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
                  <span className="text-green-600">💰</span> Package (LPA)
                </label>
                <input
                  type="number"
                  value={form.packageOffered}
                  onChange={(e) =>
                    handleFormChange("packageOffered", e.target.value)
                  }
                  placeholder="e.g. 4.5"
                  className="border border-gray-300 p-2 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-green-400"
                />
              </div>

              {/* Visit Date */}
              <div>
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
                  <span className="text-indigo-600">📅</span> Visit Date
                </label>
                <input
                  type="date"
                  value={form.visitDate}
                  onChange={(e) =>
                    handleFormChange("visitDate", e.target.value)
                  }
                  className="border border-gray-300 p-2 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {/* Students Recruited */}
              <div>
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
                  <span className="text-pink-600">👨‍🎓</span> Students Recruited
                </label>
                <input
                  type="number"
                  value={form.studentsRecruited}
                  onChange={(e) =>
                    handleFormChange("studentsRecruited", e.target.value)
                  }
                  placeholder="e.g. 10"
                  className="border border-gray-300 p-2 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-pink-400"
                />
              </div>

              {/* Mode of Visit */}
              <div>
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
                  <span className="text-yellow-600">🚪</span> Mode of Visit
                </label>
                <select
                  value={form.modeOfVisit}
                  onChange={(e) =>
                    handleFormChange("modeOfVisit", e.target.value)
                  }
                  className="border border-gray-300 p-2 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-yellow-400"
                >
                  <option>On-campus</option>
                  <option>Pool</option>
                  <option>Online</option>
                </select>
              </div>

              {/* Recruitment Type */}
              <div>
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
                  <span className="text-rose-600">🎯</span> Recruitment Type
                </label>
                <select
                  value={form.recruitmentType}
                  onChange={(e) =>
                    handleFormChange("recruitmentType", e.target.value)
                  }
                  className="border border-gray-300 p-2 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-rose-400"
                >
                  <option>Placement</option>
                  <option>Internship</option>
                  <option>Both Internship and Placement</option>
                </select>
              </div>

              {/* Image Upload */}
              <div className="col-span-full">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                  <span className="text-blue-600">🖼️</span> Company Image
                </label>

                <div className="flex items-center justify-center border-2 border-dashed border-blue-300 rounded-lg p-4 hover:bg-blue-50 transition">
                  <label className="flex flex-col items-center cursor-pointer text-blue-700 font-medium">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 mb-2 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5M16 10l-4-4m0 0l-4 4m4-4v12"
                      />
                    </svg>
                    <span>Click to upload image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFileChoose(e.target.files[0])}
                    />
                  </label>
                </div>

                {form.imageUrl && (
                  <div className="mt-3 flex justify-center">
                    <img
                      src={form.imageUrl}
                      alt="preview"
                      className="w-40 h-40 object-cover rounded-xl shadow-md border border-blue-200"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={saveForm}
                disabled={uploading}
                className={`px-5 py-2 rounded-lg ${
                  uploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white shadow-md`}
              >
                {uploading
                  ? "Uploading..."
                  : editing
                  ? "💾 Save Changes"
                  : "✅ Create Entry"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expenses modal */}
      {selectedCompanyForExpenses && (
        <CompanyExpensesModal
          company={selectedCompanyForExpenses}
          onClose={() => {
            setSelectedCompanyForExpenses(null);
            fetchCompanies();
          }}
          role={role}
        />
      )}
    </div>
  );
}
