"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

export default function AdminHomeHeroPage() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  // ✅ Fetch all hero images
  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseURL}/api/home-hero`);
      setImages(res.data);
    } catch (err) {
      console.error("Error fetching hero images:", err);
      toast.error("Failed to fetch images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // ✅ Upload new hero image
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select an image");

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      await axios.post(`${baseURL}/api/home-hero`, formData);
      toast.success("Hero image uploaded successfully!");
      setFile(null);
      setPreview(null);
      fetchImages();
    } catch (err) {
      toast.error("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete hero image
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      setLoading(true);
      await axios.delete(`${baseURL}/api/home-hero/${id}`);
      toast.info("Image deleted");
      fetchImages();
    } catch (err) {
      toast.error("Failed to delete image");
    } finally {
      setLoading(false);
    }
  };

  // ✅ File preview
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">
          Manage Homepage Hero Images
        </h1>

        {/* ✅ Upload Form */}
        <form
          onSubmit={handleUpload}
          className="bg-white border border-gray-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row items-center gap-4 mb-8"
        >
          <div className="flex flex-col flex-1 w-full">
            <label className="text-gray-600 font-medium mb-1">
              Upload New Hero Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-medium transition-all duration-300 mt-3 md:mt-8"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>

        {/* ✅ Preview Section */}
        {preview && (
          <div className="mb-8 flex justify-center">
            <div className="bg-white rounded-xl shadow-md p-3 border">
              <img
                src={preview}
                alt="Preview"
                className="w-60 h-40 object-cover rounded-md"
              />
              <p className="text-center text-gray-500 mt-2 text-sm">Preview</p>
            </div>
          </div>
        )}

        {/* ✅ Gallery Section */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">
            Loading images...
          </div>
        ) : images.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No hero images uploaded yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
            {images.map((img) => (
              <div
                key={img._id}
                className="relative bg-white rounded-2xl shadow-md hover:shadow-lg transition-transform duration-300 hover:scale-105 overflow-hidden"
              >
                <img
                  src={img.image?.url}
                  alt="Hero"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => handleDelete(img._id)}
                    className="bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600 transition"
                    title="Delete Image"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
