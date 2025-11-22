"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Box,
  Card,
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  Avatar,
  Button,
  CircularProgress,
  CardContent,
  CardActions,
  IconButton,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { FaUpload } from "react-icons/fa";

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Other",
    description: "",
    eventDate: "",
    conductedBy: "",
    targetAudience: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);

  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const fetchEvents = async () => {
    try {
      setLoadingEvents(true);
      const res = await axios.get(`${baseURL}/api/events`);
      setEvents(res.data || []);
    } catch {
      toast.error("Failed to load events");
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((p) => ({ ...p, image: file }));
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.eventDate) {
      return toast.error("Please fill required fields!");
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (key === "image" && !val) return;
      data.append(key, val);
    });

    try {
      setSubmitting(true);

      if (editingId) {
        await axios.put(`${baseURL}/api/events/${editingId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Event Updated!");
      } else {
        if (!formData.image) return toast.error("Upload an image");
        await axios.post(`${baseURL}/api/events`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Event Added!");
      }

      resetForm();
      fetchEvents();
    } catch {
      toast.error("Failed to save!");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      category: "Other",
      description: "",
      eventDate: "",
      conductedBy: "",
      targetAudience: "",
      image: null,
    });
    setPreview(null);
  };

  const handleEdit = (ev) => {
    setEditingId(ev._id);
    setFormData({
      title: ev.title,
      category: ev.category,
      description: ev.description,
      eventDate: ev.eventDate?.split("T")[0],
      conductedBy: ev.conductedBy,
      targetAudience: ev.targetAudience,
      image: null,
    });
    setPreview(ev.image?.url || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast.info(`Editing ${ev.title}`);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await axios.delete(`${baseURL}/api/events/${id}`);
      toast.success("Event Deleted!");
      fetchEvents();
    } catch {
      toast.error("Delete failed!");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", py: 6, px: 2, background: "#f5f8ff" }}>
      <Typography variant="h4" mb={2} textAlign="center" fontWeight="bold">
        {editingId ? "Edit Event" : "Add New Event"}
      </Typography>

      <Card sx={{ maxWidth: 900, mx: "auto", p: 4, mb: 6 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* LEFT */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Event Title *"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    fullWidth
                    required
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Select
                    fullWidth
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    size="small"
                  >
                    {[
                      "Training",
                      "Workshop",
                      "Industry Visit",
                      "Placement Drive",
                      "Seminar",
                      "Guest Lecture",
                      "Other",
                    ].map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    type="date"
                    fullWidth
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Conducted By"
                    name="conductedBy"
                    fullWidth
                    size="small"
                    value={formData.conductedBy}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Target Audience"
                    name="targetAudience"
                    fullWidth
                    size="small"
                    value={formData.targetAudience}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                  <TextField
                    label="Description *"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    fullWidth
                    multiline
                    minRows={4}
                    maxRows={10}
                    size="small"
                    sx={{ whiteSpace: "pre-wrap" }}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* RIGHT */}
            <Grid
              item
              xs={12}
              md={4}
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
            >
              <Avatar
                src={preview || ""}
                variant="rounded"
                sx={{
                  width: "100%",
                  height: 140,
                  borderRadius: 2,
                  border: "2px solid #1976d2",
                  objectFit: "cover",
                }}
              />

              <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <FaUpload />
                Upload Image OF EVENT
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
              </label>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                color={editingId ? "warning" : "primary"}
                startIcon={editingId ? <Edit /> : <Add />}
              >
                {submitting ? "Saving..." : editingId ? "Update Event" : "Create Event"}
              </Button>

              {editingId && (
                <Button variant="text" fullWidth onClick={resetForm}>
                  Cancel Edit
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
      </Card>

      {/* EVENTS LIST */}
      <Box maxWidth="1000px" mx="auto">
        <Typography variant="h6" mb={2}>
          All Events
        </Typography>

        {loadingEvents ? (
          <Box textAlign="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : events.length === 0 ? (
          <Typography>No events found</Typography>
        ) : (
          <Grid container spacing={2}>
            {events.map((ev) => (
              <Grid item xs={12} key={ev._id}>
                <Card sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" } }}>
                  {/* IMAGE */}
                  <img
                    src={ev.image?.url}
                    alt={ev.title}
                    style={{
                      width: 150,
                      height: "100%",
                      objectFit: "cover",
                      borderTopLeftRadius: "8px",
                      borderBottomLeftRadius: "8px",
                    }}
                  />

                  {/* TEXT */}
                  <Box sx={{ flex: 1 }}>
                    <CardContent>
                      <Typography fontWeight="bold">{ev.title}</Typography>
                      <Typography variant="body2">
                        {new Date(ev.eventDate).toLocaleDateString()} • {ev.category}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1,
                          whiteSpace: "pre-wrap",
                          overflowWrap: "break-word",
                          maxHeight: 120,
                          overflowY: "auto",
                        }}
                      >
                        {ev.description}
                      </Typography>
                    </CardContent>

                    <CardActions sx={{ display: "flex", justifyContent: "flex-end", px: 2, pb: 2 }}>
                      <IconButton onClick={() => handleEdit(ev)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(ev._id)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </CardActions>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
