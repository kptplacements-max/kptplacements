"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function PrincipalReviewExpenses() {
  const { user } = useUser();
  const role = user?.publicMetadata?.role;

  if (role !== "principal") {
    return (
      <div className="p-6 text-red-600">
        Access denied. Only Principal can approve expenses.
      </div>
    );
  }

  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    loadExpenses();
  }, []);

  async function loadExpenses() {
    try {
      const res = await axios.get(`${API}/api/company-expenses`);
      setExpenses(res.data);
    } catch (err) {
      alert("Failed to fetch expenses");
    }
  }

  async function togglePrincipalApproval(exp) {
    try {
      await axios.put(`${API}/api/company-expenses/${exp._id}`, {
        approvedByPrincipal: !exp.approvedByPrincipal,
      });

      loadExpenses();
    } catch {
      alert("Failed to update");
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Principal – Approve Expenses</h2>

      {expenses.map((exp) => (
        <div
          key={exp._id}
          className="border p-4 rounded bg-white shadow-md mb-4"
        >
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold text-lg">
                {exp.company?.companyName || `OTHER: ${exp.otherCategory}`}
              </h3>
              <p className="text-sm text-gray-600">
                Submitted by: <b>{exp.submittedBy}</b>
              </p>
              <p className="text-sm text-gray-500">
                Officer:{" "}
                {exp.approvedByOfficer ? (
                  <span className="text-green-600">Approved</span>
                ) : (
                  <span className="text-red-600">Not Approved</span>
                )}
              </p>
            </div>

            {/* Principal badge */}
            <div>
              {exp.approvedByPrincipal ? (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded">
                  Principal Approved
                </span>
              ) : (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded">
                  Pending
                </span>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="mt-4">
            {exp.items.map((item, i) => (
              <div
                key={i}
                className="flex justify-between border-b py-1 text-sm"
              >
                <span>{item.description}</span>
                <span className="font-semibold">₹{item.amount}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-3 font-semibold">
            <span>Total:</span>
            <span>₹{exp.totalAmount}</span>
          </div>

          <button
            onClick={() => togglePrincipalApproval(exp)}
            className={`px-4 py-2 mt-4 text-white rounded ${
              exp.approvedByPrincipal
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {exp.approvedByPrincipal ? "Unapprove" : "Approve"}
          </button>
        </div>
      ))}
    </div>
  );
}
