import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getPlacementData = async (year) => {
  const res = await axios.get(`${API_URL}/api/placements/${year}`);
  return res.data;
};

export const getAllPlacementYears = async () => {
  const res = await axios.get(`${API_URL}/api/placements`);
  return res.data;
};
