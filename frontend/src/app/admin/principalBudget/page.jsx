"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function PrincipalBudgetPage() {
  const { user } = useUser();
  const role = user?.publicMetadata?.role;

  if (role !== "principal") {
    return (
      <div className="p-6 text-red-600">
        Access denied. Only Principal can manage budget.
      </div>
    );
  }

  const [budget, setBudget] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBudget();
  }, []);

  async function loadBudget() {
    try {
      const res = await axios.get(`${API}/api/budget`);
      setBudget(res.data.totalBudget || 0);
      setLoading(false);
    } catch {
      alert("Failed to load budget");
      setLoading(false);
    }
  }

  async function saveBudget() {
    try {
      await axios.post(`${API}/api/budget`, {
        totalBudget: Number(budget),
      });

      alert("Budget updated!");
    } catch {
      alert("Failed to update budget");
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Principal – Manage Total Budget</h2>

      <label className="font-semibold">Total Placement Budget (₹)</label>
      <input
        type="number"
        className="border p-2 rounded w-full mt-2"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
      />

      <button
        onClick={saveBudget}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Save Budget
      </button>
    </div>
  );
}
