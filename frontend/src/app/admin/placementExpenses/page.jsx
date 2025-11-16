"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function OfficerReviewPage() {
  const { user, isLoaded } = useUser();

  // --------------- STATES ------------------
  const [budgetInfo, setBudgetInfo] = useState({
    totalBudget: 0,
    totalUsed: 0,
    remaining: 0,
  });

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // --------------- LOAD BUDGET USAGE ------------------
  useEffect(() => {
    async function loadBudget() {
      try {
        const res = await axios.get(`${API}/api/budget-usage`);
        setBudgetInfo(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    loadBudget();
  }, []);

  // --------------- LOAD ALL EXPENSES ------------------
  useEffect(() => {
    fetchExpenses();
  }, []);

  async function fetchExpenses() {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/company-expenses`);
      setExpenses(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }

  // --------------- TOGGLE OFFICER APPROVAL ------------------
  async function toggleOfficerApproval(expense) {
    try {
      await axios.put(`${API}/api/company-expenses/${expense._id}`, {
        approvedByOfficer: !expense.approvedByOfficer,
      });
      fetchExpenses();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  }

  // --------------- DELETE EXPENSE ------------------
  async function deleteExpense(id) {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      await axios.delete(`${API}/api/company-expenses/${id}`);
      fetchExpenses();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }

  // WAIT UNTIL USER LOADED
  if (!isLoaded) return <div>Loading...</div>;

  const role = user?.publicMetadata?.role;

  if (role !== "placement-officer") {
    return (
      <div className="p-6 text-red-600">
        Access denied — only Placement Officer can review expenses.
      </div>
    );
  }

  // --------------- UI ------------------
  return (
    <div className="p-6">
      
      {/* BUDGET SUMMARY BOX */}
      <div className="mb-6 p-4 bg-blue-100 border border-blue-300 rounded">
        <h3 className="font-bold text-lg text-blue-800">Budget Overview</h3>
        <p><strong>Total Budget:</strong> ₹{budgetInfo.totalBudget}</p>
        <p><strong>Used:</strong> ₹{budgetInfo.totalUsed}</p>
        <p className="text-green-700 font-bold">
          <strong>Remaining:</strong> ₹{budgetInfo.remaining}
        </p>
      </div>

      <h2 className="text-3xl font-bold mb-6">Review Company Expenses</h2>

      {loading ? (
        <div>Loading...</div>
      ) : expenses.length === 0 ? (
        <div className="text-gray-600">No expenses found.</div>
      ) : (
        <div className="space-y-4">

          {expenses.map((exp) => {
            const total =
              exp.totalAmount ||
              exp.items.reduce((sum, i) => sum + i.amount, 0);

            return (
              <div
                key={exp._id}
                className="border rounded-lg p-4 bg-white shadow-sm"
              >
                {/* HEADER */}
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {exp.company
                        ? `${exp.company.companyName} (${exp.company.location})`
                        : `Other: ${exp.otherCategory}`}
                    </h3>

                    {exp.company?.visitDate && (
                      <p className="text-sm text-gray-600">
                        {new Date(exp.company.visitDate).toLocaleDateString()}
                      </p>
                    )}

                    <p className="text-xs text-gray-500 mt-1">
                      Submitted by: <strong>{exp.submittedBy}</strong>
                    </p>
                  </div>

                  {/* STATUS BADGE */}
                  <div>
                    {exp.approvedByOfficer ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded">
                        Officer Approved
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded">
                        Pending
                      </span>
                    )}
                  </div>
                </div>

                {/* ITEMS LIST */}
                <div className="mt-4">
                  {exp.items.map((item, i) => (
                    <div key={i} className="flex justify-between border-b py-1 text-sm">
                      <span>{item.description}</span>
                      <span className="font-semibold">₹{item.amount}</span>
                    </div>
                  ))}
                </div>

                {/* TOTAL */}
                <div className="flex justify-between mt-3 font-semibold">
                  <span>Total:</span>
                  <span>₹{total}</span>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => toggleOfficerApproval(exp)}
                    className={`px-4 py-2 rounded text-white ${
                      exp.approvedByOfficer
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-emerald-600 hover:bg-emerald-700"
                    }`}
                  >
                    {exp.approvedByOfficer ? "Unapprove" : "Approve"}
                  </button>

                  {!exp.approvedByPrincipal && (
                    <button
                      onClick={() => deleteExpense(exp._id)}
                      className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}

        </div>
      )}
    </div>
  );
}
