"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import TextField from "@mui/material/TextField";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function AddExpensesPage() {
  const { user, isLoaded } = useUser();
  const [companies, setCompanies] = useState([]);
  const [companyId, setCompanyId] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [items, setItems] = useState([{ description: "", amount: "" }]);

  // ⭐ For viewing/editing/deleting submitted expenses
  const [myExpenses, setMyExpenses] = useState([]);
  const [editing, setEditing] = useState(null);

  if (!isLoaded) return <div>Loading...</div>;

  const role = user?.publicMetadata?.role;
  const currentUser =
    user.fullName || user.firstName || user.username || "Unknown User";

  if (role !== "placement-coordinator") {
    return (
      <div className="p-6 text-red-600">
        Access denied. Placement Coordinator only.
      </div>
    );
  }
const [budgetInfo, setBudgetInfo] = useState({
  totalBudget: 0,
  totalUsed: 0,
  remaining: 0,
});

// Load budget usage
useEffect(() => {
  async function loadBudgetUsage() {
    try {
      const res = await axios.get(`${API}/api/budget-usage`);
      setBudgetInfo(res.data);
    } catch (err) {
      console.error(err);
    }
  }
  loadBudgetUsage();
}, []);

  // FETCH COMPANIES
  useEffect(() => {
    async function loadCompanies() {
      try {
        const res = await axios.get(`${API}/api/visited-companies`);
        setCompanies(res.data || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load companies");
      }
    }
    loadCompanies();
  }, []);

  // FETCH MY EXPENSES
  useEffect(() => {
    async function loadExpenses() {
      try {
        const res = await axios.get(`${API}/api/company-expenses`);
        setMyExpenses(res.data.filter((e) => e.submittedBy === currentUser));
      } catch (err) {
        console.error(err);
      }
    }
    loadExpenses();
  }, []);

  function addRow() {
    setItems((prev) => [...prev, { description: "", amount: "" }]);
  }

  function removeRow(index) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateRow(index, field, value) {
    setItems((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
  }

  async function submit() {
    if (!companyId) return alert("Select a company first");

    if (companyId === "other" && otherCategory.trim() === "")
      return alert("Enter category for OTHER");

    const validItems = items.filter(
      (i) => i.description.trim() && Number(i.amount) > 0
    );

    try {
      await axios.post(`${API}/api/company-expenses`, {
        company: companyId === "other" ? null : companyId,
        otherCategory: companyId === "other" ? otherCategory : null,
        submittedBy: currentUser,
        items: validItems.map((i) => ({
          description: i.description,
          amount: Number(i.amount),
        })),
      });

      alert("Expenses added successfully!");
      setItems([{ description: "", amount: "" }]);
      setCompanyId("");
      setOtherCategory("");

      // Reload list
      const res = await axios.get(`${API}/api/company-expenses`);
      setMyExpenses(res.data.filter((e) => e.submittedBy === currentUser));
    } catch (err) {
      console.error(err);
      alert("Failed to submit expenses");
    }
  }

  // DELETE EXPENSE
  async function deleteExpense(id) {
    if (!confirm("Delete this expense?")) return;

    try {
      await axios.delete(`${API}/api/company-expenses/${id}`);
      setMyExpenses((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  }

  // SAVE UPDATED EXPENSE
  async function saveEdit() {
    try {
      await axios.put(`${API}/api/company-expenses/${editing._id}`, {
        items: editing.items,
      });

      alert("Updated!");

      setEditing(null);

      const res = await axios.get(`${API}/api/company-expenses`);
      setMyExpenses(res.data.filter((e) => e.submittedBy === currentUser));
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    }
  }

  return (
    <div className="p-6">
        {/* Remaining Budget Box */}
<div className="mb-6 p-4 bg-blue-100 border border-blue-300 rounded">
  <h3 className="font-bold text-lg text-blue-800">Budget Overview</h3>
  <p className="text-gray-700">
    <strong>Total Budget:</strong> ₹{budgetInfo.totalBudget}
  </p>
  <p className="text-gray-700">
    <strong>Used:</strong> ₹{budgetInfo.totalUsed}
  </p>
  <p className="text-green-700 font-bold">
    <strong>Remaining:</strong> ₹{budgetInfo.remaining}
  </p>
</div>

      {/* ------------------------ */}
      {/* ADD EXPENSE SECTION */}
      {/* ------------------------ */}
      <h2 className="text-3xl font-bold mb-6">Add Placement Expenses</h2>

      <div className="mb-4">
        <label className="font-semibold">Select Company</label>
        <select
          className="border p-2 rounded w-full mt-1"
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
        >
          <option value="">-- Select Company --</option>
          {companies.map((c) => (
            <option key={c._id} value={c._id}>
              {c.companyName} ({c.location})
            </option>
          ))}

          <option value="other">Other Expense (Not a Company)</option>
        </select>
      </div>

      {companyId === "other" && (
        <div className="mb-4">
          <TextField
            label="Enter Category (Stationery, Travel, Food, etc)"
            fullWidth
            value={otherCategory}
            onChange={(e) => setOtherCategory(e.target.value)}
          />
        </div>
      )}

      <h3 className="font-semibold text-lg mb-2">Expense Items</h3>

      {items.map((item, idx) => (
        <div key={idx} className="flex gap-3 mb-3">
          <TextField
            label="Description"
            fullWidth
            value={item.description}
            onChange={(e) => updateRow(idx, "description", e.target.value)}
          />

          <TextField
            label="Amount"
            type="number"
            sx={{ width: 120 }}
            value={item.amount}
            onChange={(e) => updateRow(idx, "amount", e.target.value)}
          />

          <button
            onClick={() => removeRow(idx)}
            className="px-3 bg-red-500 text-white rounded"
          >
            X
          </button>
        </div>
      ))}

      <button
        onClick={addRow}
        className="px-3 py-1 bg-green-600 text-white rounded mr-3"
      >
        Add Row
      </button>

      <button
        onClick={submit}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Submit Expenses
      </button>

      {/* ------------------------------------ */}
      {/* SEE MY SUBMITTED EXPENSES SECTION    */}
      {/* ------------------------------------ */}
      <h2 className="text-2xl font-bold mt-10 mb-4">My Submitted Expenses</h2>

      {myExpenses.length === 0 && (
        <p className="text-gray-500">No expenses submitted.</p>
      )}

      <div className="space-y-4">
        {myExpenses.map((exp) => (
          <div key={exp._id} className="border p-4 rounded bg-white shadow">
            <p className="font-semibold">
              {exp.company
                ? `${exp.company.companyName} (${exp.company.location})`
                : `Other: ${exp.otherCategory}`}
            </p>

            <ul className="list-disc ml-5 my-2">
              {exp.items.map((i, idx) => (
                <li key={idx}>
                  {i.description} — ₹{i.amount}
                </li>
              ))}
            </ul>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  setEditing({
                    ...exp,
                    items: exp.items.map((i) => ({ ...i })),
                  })
                }
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteExpense(exp._id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-5 rounded shadow-xl w-[500px]">
            <h3 className="text-xl font-bold mb-3">Edit Expense</h3>

            {editing.items.map((it, index) => (
              <div key={index} className="flex gap-3 mb-2">
                <input
                  className="border p-2 flex-1"
                  value={it.description}
                  onChange={(e) => {
                    const updated = [...editing.items];
                    updated[index].description = e.target.value;
                    setEditing({ ...editing, items: updated });
                  }}
                />

                <input
                  className="border p-2 w-24"
                  type="number"
                  value={it.amount}
                  onChange={(e) => {
                    const updated = [...editing.items];
                    updated[index].amount = Number(e.target.value);
                    setEditing({ ...editing, items: updated });
                  }}
                />
              </div>
            ))}

            <button
              onClick={saveEdit}
              className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
            >
              Save
            </button>

            <button
              onClick={() => setEditing(null)}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
