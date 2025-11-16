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

  const [myExpenses, setMyExpenses] = useState([]);
  const [editing, setEditing] = useState(null);

  const [budgetInfo, setBudgetInfo] = useState({
    totalBudget: 0,
    totalUsed: 0,
    remaining: 0,
  });

  if (!isLoaded) return <div>Loading...</div>;

  const role = user?.publicMetadata?.role;
  const currentUser =
    user.fullName || user.firstName || user.username || "Placement office";

  if (role !== "placement-coordinator") {
    return (
      <div className="p-6 text-red-600">
        Access denied. Placement Coordinator only.
      </div>
    );
  }

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

  // Fetch companies
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

  // Fetch my expenses
  useEffect(() => {
    async function loadExpenses() {
      try {
        const res = await axios.get(`${API}/api/company-expenses?role=placement-coordinator&user=${currentUser}`);

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
    <div className="p-6 max-w-5xl mx-auto">

      {/* ========================== */}
      {/* ADD EXPENSE FORM */}
      {/* ========================== */}

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

      {/* ========================== */}
      {/* MY EXPENSES TABLE */}
      {/* ========================== */}

      <h2 className="text-2xl font-bold mt-12 mb-4">My Submitted Expenses</h2>
{/* ========================== */}
{/*     ⭐ BUDGET OVERVIEW      */}
{/* ========================== */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 mb-10">

  <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-blue-600">
    <p className="text-gray-500 text-sm">Total Budget</p>
    <h3 className="text-2xl font-bold text-blue-700">
      ₹{budgetInfo.totalBudget}
    </h3>
  </div>

  <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-red-600">
    <p className="text-gray-500 text-sm">Used Budget</p>
    <h3 className="text-2xl font-bold text-red-700">
      ₹{budgetInfo.totalUsed}
    </h3>
  </div>

  <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-green-600">
    <p className="text-gray-500 text-sm">Remaining Budget</p>
    <h3 className="text-2xl font-bold text-green-700">
      ₹{budgetInfo.remaining}
    </h3>
  </div>

</div>

      {myExpenses.length === 0 ? (
        <p className="text-gray-500">No expenses submitted.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">Company / Category</th>
                <th className="p-3 text-left">Items</th>
                <th className="p-3 text-left">Total Amount</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {myExpenses.map((exp) => {
                const total = exp.items.reduce((sum, i) => sum + i.amount, 0);

                return (
                  <tr key={exp._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">
                      {exp.company
                        ? `${exp.company.companyName} (${exp.company.location})`
                        : `Other: ${exp.otherCategory}`}
                    </td>

                    <td className="p-3">
                      <ul className="list-disc ml-5">
                        {exp.items.map((i, idx) => (
                          <li key={idx}>
                            {i.description} — ₹{i.amount}
                          </li>
                        ))}
                      </ul>
                    </td>

                    <td className="p-3 font-bold text-blue-700">₹{total}</td>

                    <td className="p-3 flex gap-2">
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
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ====================== */}
      {/* EDIT MODAL */}
      {/* ====================== */}
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
