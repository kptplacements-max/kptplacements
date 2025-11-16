"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function SWOfficerReviewExpenses() {
  const { user } = useUser();
  const role = user?.publicMetadata?.role;

  if (role !== "sw-officer") {
    return (
      <div className="p-6 text-red-600">
        Access denied. Only SW-Officer can review expenses.
      </div>
    );
  }

  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);

  useEffect(() => {
    loadPending();
    loadApproved();
  }, []);

  // 🔵 Load expenses waiting for SW approval
  async function loadPending() {
    try {
      const res = await axios.get(`${API}/api/company-expenses?role=sw-officer`);
      setPending(res.data);
    } catch (err) {
      alert("Failed to fetch pending expenses");
    }
  }

  // 🟢 Load already approved expenses (readonly)
  async function loadApproved() {
    try {
      const res = await axios.get(
        `${API}/api/company-expenses?approvedBySWOfficer=true`
      );
      setApproved(res.data);
    } catch (err) {
      alert("Failed to fetch approved expenses");
    }
  }

  // ✔ SW Officer Approve Only (NO UNAPPROVE)
  async function approveExpense(exp) {
    try {
      await axios.put(`${API}/api/company-expenses/${exp._id}`, {
        approvedBySWOfficer: true,
      });

      loadPending();
      loadApproved();
    } catch (err) {
      alert("Failed to approve");
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">SW Officer – Review Expenses</h2>

      {/* ----------------------------------------- */}
      {/* 🔵 PENDING EXPENSES */}
      {/* ----------------------------------------- */}
      <h3 className="text-xl font-semibold mb-3 text-yellow-700">
        Pending Approval
      </h3>

      {pending.length === 0 && (
        <p className="text-gray-500 mb-8">No pending expenses.</p>
      )}

      {pending.map((exp) => {
        const total = exp.items.reduce((s, i) => s + i.amount, 0);
        return (
          <div key={exp._id} className="border p-4 rounded bg-white shadow-md mb-4">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold text-lg">
                  {exp.company?.companyName || `OTHER: ${exp.otherCategory}`}
                </h3>

                <p className="text-sm text-gray-600">
                  Submitted by: <b>{exp.submittedBy}</b>
                </p>

                <p className="text-sm text-gray-500">
                  Officer Approval:
                  {exp.approvedByOfficer ? (
                    <span className="text-green-600 ml-1">Approved</span>
                  ) : (
                    <span className="text-red-600 ml-1">Pending</span>
                  )}
                </p>
              </div>

              <div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded">
                  Pending
                </span>
              </div>
            </div>

            <div className="mt-4">
              {exp.items.map((item, i) => (
                <div key={i} className="flex justify-between border-b py-1 text-sm">
                  <span>{item.description}</span>
                  <span className="font-semibold">₹{item.amount}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-3 font-semibold">
              <span>Total:</span>
              <span>₹{total}</span>
            </div>

            <button
              onClick={() => approveExpense(exp)}
              className="px-4 py-2 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Approve
            </button>
          </div>
        );
      })}

      {/* ----------------------------------------- */}
      {/* 🟢 APPROVED EXPENSES  (Read Only) */}
      {/* ----------------------------------------- */}
      <h3 className="text-xl font-semibold mb-3 text-green-700 mt-10">
        Approved Expenses
      </h3>

      {approved.length === 0 && (
        <p className="text-gray-500">No approved expenses yet.</p>
      )}

      {approved.map((exp) => {
        const total = exp.items.reduce((s, i) => s + i.amount, 0);
        return (
          <div key={exp._id} className="border p-4 rounded bg-green-50 shadow-md mb-4">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold text-lg">
                  {exp.company?.companyName || `OTHER: ${exp.otherCategory}`}
                </h3>

                <p className="text-sm text-gray-600">
                  Submitted by: <b>{exp.submittedBy}</b>
                </p>
              </div>

              <span className="px-3 py-1 bg-green-200 text-green-800 rounded">
                Approved
              </span>
            </div>

            <div className="mt-4">
              {exp.items.map((item, i) => (
                <div key={i} className="flex justify-between border-b py-1 text-sm">
                  <span>{item.description}</span>
                  <span className="font-semibold">₹{item.amount}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-3 font-semibold">
              <span>Total:</span>
              <span>₹{total}</span>
            </div>

            {/* ❌ No Unapprove — Read Only */}
          </div>
        );
      })}
    </div>
  );
}
