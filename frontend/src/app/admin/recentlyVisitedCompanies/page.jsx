"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function VisitedCompanyManager() {
  const { user } = useUser();
  const role = user?.publicMetadata?.role;
  const isCoordinator = role === "placement-coordinator";

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

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
    studentsRecruited: 0,
    modeOfVisit: "On-campus",
    recruitmentType: "Placement",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  async function fetchCompanies() {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/visited-companies`);
      setCompanies(res.data || []);
    } catch (error) {
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
      studentsRecruited: 0,
      modeOfVisit: "On-campus",
      recruitmentType: "Placement",
      image: null,
    });
    setPreview(null);
    setShowForm(true);
  }

  function openEdit(company) {
    setEditing(company);

    setForm({
      companyName: company.companyName,
      branchList: company.branchList,
      location: company.location,
      packageOffered: company.packageOffered,
      visitDate: new Date(company.visitDate).toISOString().substring(0, 10),
      studentsRecruited: company.studentsRecruited,
      modeOfVisit: company.modeOfVisit,
      recruitmentType: company.recruitmentType,
      image: null,
    });

    setPreview(company.image?.url || null);
    setShowForm(true);
  }

  function handleFormChange(field, value) {
    if (field === "branchList") {
      const arr = value.split(",").map((s) => s.trim());
      setForm((f) => ({ ...f, branchList: arr }));
    } else {
      setForm((f) => ({ ...f, [field]: value }));
    }
  }

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    setForm((f) => ({ ...f, image: file }));
    setPreview(URL.createObjectURL(file));
  }

  async function saveForm() {
    try {
      setUploading(true);

      const fd = new FormData();

      fd.append("companyName", form.companyName);
      fd.append("location", form.location);
      fd.append("packageOffered", form.packageOffered);
      fd.append("visitDate", form.visitDate);
      fd.append("studentsRecruited", form.studentsRecruited);
      fd.append("modeOfVisit", form.modeOfVisit);
      fd.append("recruitmentType", form.recruitmentType);

      fd.append("branchList", JSON.stringify(form.branchList));

      if (form.image) fd.append("image", form.image);

      if (editing) {
        await axios.put(`${API}/api/visited-companies/${editing._id}`, fd);
        alert("Updated");
      } else {
        await axios.post(`${API}/api/visited-companies`, fd);
        alert("Created");
      }

      setShowForm(false);
      fetchCompanies();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setUploading(false);
    }
  }

  async function deleteCompany(id) {
    if (!confirm("Delete this company visit?")) return;

    try {
      await axios.delete(`${API}/api/visited-companies/${id}`);
      fetchCompanies();
    } catch (err) {
      alert("Delete failed");
    }
  }

  return (
    <div className="p-6 text-gray-600">

      {/* FILTERS + ADD */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Recently Visited Companies</h2>

        <div className="flex gap-2">
          <input
            placeholder="Branch"
            value={filters.branch}
            onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
            className="border px-2 py-1 rounded"
          />

          <input
            placeholder="Company"
            value={filters.company}
            onChange={(e) => setFilters({ ...filters, company: e.target.value })}
            className="border px-2 py-1 rounded"
          />

          <input
            placeholder="Location"
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
            className="border px-2 py-1 rounded"
          />

          <button
            onClick={() => setFilters({ branch: "", company: "", location: "" })}
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

      {/* COMPANY LIST */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {applyFilters(companies).map((c) => (
            <div key={c._id} className="bg-white p-4 rounded-lg shadow flex gap-4">
              
              <img
                src={c.image?.url || "/placeholder.jpg"}
                className="w-28 h-28 object-cover rounded-md"
              />

              <div className="flex-1">
                <h3 className="text-lg font-semibold">{c.companyName}</h3>

                <div className="text-sm text-gray-600">
                  {c.branchList.join(", ")} • {c.location}
                </div>

                <div className="text-sm mt-2">
                  Package: <strong>{c.packageOffered} LPA</strong> • Visited:{" "}
                  {new Date(c.visitDate).toLocaleDateString()}
                </div>

                <div className="text-sm mt-1">
                  Students recruited: <strong>{c.studentsRecruited}</strong>
                </div>

                {isCoordinator && (
                  <div className="flex gap-2 mt-3">
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
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl shadow-xl">

            <h3 className="text-xl font-semibold mb-4">
              {editing ? "Edit Company" : "Add Company"}
            </h3>

            {/* Form UI — you already have it */}
            {/* FORM FIELDS */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

  {/* Company Name */}
  <input
    type="text"
    placeholder="Company Name"
    value={form.companyName}
    onChange={(e) => handleFormChange("companyName", e.target.value)}
    className="border p-2 rounded"
  />

  {/* Branch List */}
  <input
    type="text"
    placeholder="Branches (comma separated)"
    value={form.branchList.join(", ")}
    onChange={(e) => handleFormChange("branchList", e.target.value)}
    className="border p-2 rounded"
  />

  {/* Location */}
  <input
    type="text"
    placeholder="Location"
    value={form.location}
    onChange={(e) => handleFormChange("location", e.target.value)}
    className="border p-2 rounded"
  />

  {/* Package */}
  <input
    type="number"
    placeholder="Package Offered (LPA)"
    value={form.packageOffered}
    onChange={(e) => handleFormChange("packageOffered", e.target.value)}
    className="border p-2 rounded"
  />

  {/* Visit Date */}
  <input
    type="date"
    value={form.visitDate}
    onChange={(e) => handleFormChange("visitDate", e.target.value)}
    className="border p-2 rounded"
  />

  {/* Students Recruited */}
  <input
    type="number"
    placeholder="Students Recruited"
    value={form.studentsRecruited}
    onChange={(e) =>
      handleFormChange("studentsRecruited", e.target.value)
    }
    className="border p-2 rounded"
  />

  {/* Mode of Visit */}
  <select
    value={form.modeOfVisit}
    onChange={(e) => handleFormChange("modeOfVisit", e.target.value)}
    className="border p-2 rounded"
  >
    <option>On-campus</option>
    <option>Pool</option>
    <option>Online</option>
  </select>

  {/* Recruitment Type */}
  <select
    value={form.recruitmentType}
    onChange={(e) => handleFormChange("recruitmentType", e.target.value)}
    className="border p-2 rounded"
  >
    <option>Placement</option>
    <option>Internship</option>
    <option>Both Internship and Placement</option>
  </select>

  {/* Image Upload */}
  <div>
    <input type="file" accept="image/*" onChange={handleImage} />
    {preview && (
      <img
        src={preview}
        className="w-32 h-32 object-cover rounded mt-2"
      />
    )}
  </div>
</div>


            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={saveForm}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {editing ? "Update" : "Create"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
