"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// MUI COMPONENTS
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LinkIcon from "@mui/icons-material/Link";

export default function AnnouncementsAdminPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "",
    date: "",
    link: "",
  });
  const [editingId, setEditingId] = useState(null);

  const baseURL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/announcements`);
      setAnnouncements(res.data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [baseURL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(`${baseURL}/api/announcements/${editingId}`, formData);
        toast.success("Announcement updated successfully!");
      } else {
        await axios.post(`${baseURL}/api/announcements`, formData);
        toast.success("Announcement added successfully!");
      }

      setFormData({
        title: "",
        description: "",
        department: "",
        date: "",
        link: "",
      });
      setEditingId(null);
      fetchAnnouncements();
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const handleEdit = (a) => {
    setEditingId(a._id);
    setFormData({
      title: a.title,
      description: a.description || "",
      department: a.department || "",
      date: a.date.split("T")[0],
      link: a.link || "",
    });
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      try {
        await axios.delete(`${baseURL}/api/announcements/${id}`);
        toast.info("Announcement deleted.");
        fetchAnnouncements();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Box maxWidth="1200px" mx="auto" p={4}>
      <Typography
        variant="h4"
        textAlign="center"
        fontWeight="bold"
        mb={4}
        color="primary"
      >
        {editingId ? "Edit Announcement" : "Add New Announcement"}
      </Typography>

      {/* FORM */}
      <Card elevation={3} sx={{ mb: 5 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Title"
                  name="title"
                  required
                  fullWidth
                  value={formData.title}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Department"
                  name="department"
                  required
                  fullWidth
                  value={formData.department}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  type="date"
                  label="Date"
                  name="date"
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={formData.date}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Optional Link"
                  name="link"
                  fullWidth
                  value={formData.link}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} textAlign="center">
                {/* NORMAL HTML BUTTON (NO MUI) */}
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#1976d2",
                    color: "white",
                    padding: "10px 24px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    border: "none",
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  {editingId ? "Update Announcement" : "Add Announcement"}
                </button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Typography variant="h5" fontWeight="bold" mb={2}>
        All Announcements
      </Typography>

      {/* TABLE */}
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Title
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Department
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Date
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Description
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Link
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold" }}
                align="center"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {announcements.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  sx={{ py: 4, color: "gray" }}
                >
                  No announcements found.
                </TableCell>
              </TableRow>
            ) : (
              announcements.map((a) => (
                <TableRow key={a._id} hover>
                  <TableCell>{a.title}</TableCell>
                  <TableCell>{a.department}</TableCell>
                  <TableCell>
                    {new Date(a.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell sx={{ maxWidth: "250px" }}>
                    {a.description || "-"}
                  </TableCell>

                  <TableCell>
                    {a.link ? (
                      <a href={a.link} target="_blank" style={{ cursor: "pointer" }}>
                        <LinkIcon color="primary" />
                      </a>
                    ) : (
                      "—"
                    )}
                  </TableCell>

                  {/* NORMAL CLICKABLE ICONS */}
                  <TableCell align="center">
                    <span
                      onClick={() => handleEdit(a)}
                      style={{ cursor: "pointer", padding: "6px" }}
                    >
                      <EditIcon sx={{ color: "#ed6c02" }} />
                    </span>

                    <span
                      onClick={() => handleDelete(a._id)}
                      style={{ cursor: "pointer", padding: "6px" }}
                    >
                      <DeleteIcon sx={{ color: "#d32f2f" }} />
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
