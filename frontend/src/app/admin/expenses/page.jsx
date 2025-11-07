"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";

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

export default function CompanyExpensesModal({ company, onClose, role }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState(null);
  const [newExpenseItems, setNewExpenseItems] = useState([
    { description: "", amount: 0 },
  ]);
  const [initialAmount, setInitialAmount] = useState(5000);

  const isCoordinator = role === "placement-coordinator";
  const isOfficer = role === "placement-officer";
  const isPrincipal = role === "principal";

  useEffect(() => {
    fetchExpenses();
    // eslint-disable-next-line
  }, [company._id]);

  async function fetchExpenses() {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/company-expenses`, {
        params: { company: company._id },
      });
      setExpenses(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }

  const totals = useMemo(() => {
    const totalSpent = expenses.reduce(
      (sum, e) => sum + (e.totalAmount || 0),
      0
    );
    const lastInitial = expenses.length
      ? expenses[0].initialAmount ?? 5000
      : 5000;
    const available =
      lastInitial - (expenses.length ? expenses[0].totalAmount : 0);
    return { totalSpent, available, lastInitial };
  }, [expenses]);

  // Add / remove rows in newExpenseItems
  function addItemRow() {
    setNewExpenseItems((s) => [...s, { description: "", amount: 0 }]);
  }
  function removeItemRow(idx) {
    setNewExpenseItems((s) => s.filter((_, i) => i !== idx));
  }
  function setItemValue(idx, field, value) {
    setNewExpenseItems((s) => {
      const cp = [...s];
      cp[idx][field] = field === "amount" ? Number(value || 0) : value;
      return cp;
    });
  }

  async function submitExpense() {
    // compute total
    const total = newExpenseItems.reduce(
      (sum, it) => sum + (Number(it.amount) || 0),
      0
    );
    const payload = {
      company: company._id,
      submittedBy: "Placement Cell", // ideally real user name
      initialAmount,
      items: newExpenseItems.filter((it) => it.description && it.amount > 0),
    };
    // POST
    try {
      await axios.post(`${API}/company-expenses`, payload);
      setNewExpenseItems([{ description: "", amount: 0 }]);
      fetchExpenses();
    } catch (err) {
      console.error(err);
      alert("Submit failed");
    }
  }

  async function deleteExpense(id) {
    if (!confirm("Delete expense?")) return;
    try {
      await axios.delete(`${API}/company-expenses/${id}`);
      fetchExpenses();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }

  async function approveExpense(expense, by) {
    try {
      const payload = {};
      if (by === "officer")
        payload.approvedByOfficer = !expense.approvedByOfficer;
      if (by === "principal")
        payload.approvedByPrincipal = !expense.approvedByPrincipal;
      // update server
      await axios.put(`${API}/company-expenses/${expense._id}`, payload);
      fetchExpenses();
    } catch (err) {
      console.error(err);
      alert("Approve failed");
    }
  }

  async function editAndSaveExpense(expenseId, updatedItems) {
    try {
      await axios.put(`${API}/company-expenses/${expenseId}`, {
        items: updatedItems,
      });
      fetchExpenses();
      setEditingExpense(null);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/40 overflow-auto">
      <div className="bg-white rounded-lg w-full max-w-4xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            {company.companyName} — Expenses
          </h3>
          <div className="flex gap-2 items-center">
            <div className="text-sm text-gray-600">
              Available:{" "}
              <strong>₹{expenses[0]?.availableBalance ?? 5000}</strong>
            </div>
            <button onClick={onClose} className="px-3 py-1 bg-gray-200 rounded">
              Close
            </button>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-sm text-gray-700">
            Company Info: {company.branchList?.join(", ")} • {company.location}{" "}
            • {new Date(company.visitDate).toLocaleDateString()}
          </div>
        </div>

        {/* Existing expenses */}
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Submitted Expenses</h4>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="space-y-3">
              {expenses.length === 0 && (
                <div className="text-sm text-gray-500">
                  No expenses added yet.
                </div>
              )}
              {expenses.map((exp) => (
                <div key={exp._id} className="border rounded p-3 bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-semibold">
                        Submitted: {new Date(exp.createdAt).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">
                        By: {exp.submittedBy}
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div
                        className={`px-2 py-1 rounded text-sm ${
                          exp.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : exp.status === "Officer Approved"
                            ? "bg-green-100 text-green-700"
                            : exp.status === "Principal Approved"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {exp.status}
                      </div>
                      <div className="text-sm font-semibold">
                        Total: ₹{exp.totalAmount}
                      </div>
                      {isCoordinator &&
                        !exp.approvedByOfficer &&
                        !exp.approvedByPrincipal && (
                          <button
                            onClick={() => deleteExpense(exp._id)}
                            className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                          >
                            Delete
                          </button>
                        )}
                    </div>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {exp.items.map((it, idx) => (
                      <div key={idx} className="text-sm">
                        • <span className="font-medium">{it.description}</span>:
                        ₹{it.amount}
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 flex gap-2">
                    {isOfficer && (
                      <button
                        onClick={() => approveExpense(exp, "officer")}
                        className="px-2 py-1 text-sm rounded bg-green-600 text-white"
                      >
                        {exp.approvedByOfficer
                          ? "Unapprove (Officer)"
                          : "Approve (Officer)"}
                      </button>
                    )}
                    {isPrincipal && (
                      <button
                        onClick={() => approveExpense(exp, "principal")}
                        className="px-2 py-1 text-sm rounded bg-blue-600 text-white"
                      >
                        {exp.approvedByPrincipal
                          ? "Unapprove (Principal)"
                          : "Approve (Principal)"}
                      </button>
                    )}
                    <div className="text-sm text-gray-600 ml-auto">
                      Available after this:{" "}
                      <strong>₹{exp.availableBalance}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add new expense (placement coordinator only) */}
        {isCoordinator && (
          <div className="mb-4 border-t pt-4">
            <h4 className="font-semibold mb-2">Add Expense (Placement Cell)</h4>

            <div className="space-y-2">
              {newExpenseItems.map((it, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    placeholder="Description"
                    value={it.description}
                    onChange={(e) =>
                      setItemValue(idx, "description", e.target.value)
                    }
                    className="flex-1 border p-2 rounded"
                  />
                  <input
                    placeholder="Amount"
                    type="number"
                    value={it.amount}
                    onChange={(e) =>
                      setItemValue(idx, "amount", e.target.value)
                    }
                    className="w-28 border p-2 rounded"
                  />
                  <button
                    onClick={() => removeItemRow(idx)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <button
                  onClick={addItemRow}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Add Item
                </button>
                <button
                  onClick={submitExpense}
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Submit Expense
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="text-right">
          <button onClick={onClose} className="px-3 py-1 bg-gray-200 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
