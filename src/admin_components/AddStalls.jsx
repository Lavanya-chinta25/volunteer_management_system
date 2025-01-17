import React, { useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddStalls = () => {
  const [formData, setFormData] = useState({
    stallName: "",
    stallImage: null,
    stallPosition: "",
  });

  const fileInputRef = useRef(null); // Ref for the file input

  // Position validation pattern
  const positionPattern =
    /^(ab[1-3])(?:\s*(g[1-9]|g10|f[1-9]|f10|s[1-9]|s10|t[1-9]|t10))+$/;

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "stallImage" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });

    const { stallName, stallImage, stallPosition } = formData;

    if (!stallName || !stallImage || !stallPosition) {
      toast.error("All fields are required.");
      return;
    }

    if (!positionPattern.test(stallPosition)) {
      toast.error(
        "Invalid position! Start with 'ab1', 'ab2', or 'ab3', followed by valid positions like 'g1', 'f10', etc."
      );
      return;
    }

    // Prepare form data for the request
    const formDataPayload = new FormData();
    formDataPayload.append("name", stallName);
    formDataPayload.append("image", stallImage);
    formDataPayload.append("position", stallPosition);

    try {
      // Send POST request to backend
      const response = await axios.post(
        "http://localhost:5000/api/stalls", // Backend endpoint
        formDataPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // Include cookies for authentication
        }
      );

      toast.success("Stall added successfully!");
      console.log("Response:", response.data);

      // Reset form and clear file input
      setFormData({
        stallName: "",
        stallImage: null,
        stallPosition: "",
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear the file input value
      }
    } catch (error) {
      console.error("Error adding stall:", error.response || error);
      toast.error("Failed to add stall. Please try again.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white">Add Stalls</h2>
      <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
        {/* Stall Name Field */}
        <div>
          <label className="text-white">Stall Name:</label>
          <input
            type="text"
            name="stallName"
            value={formData.stallName}
            onChange={handleInputChange}
            className="w-full p-2 mt-1 rounded-md placeholder-gray-400 text-black focus:shadow-[0_0_10px_rgba(255,255,255,0.7)] focus:outline-none"
            placeholder="Enter Stall Name"
          />
        </div>

        {/* Image Upload Field */}
        <div>
          <label className="text-white">Stall Image:</label>
          <input
            type="file"
            name="stallImage"
            accept="image/*"
            onChange={handleInputChange}
            className="w-full p-2 mt-1 rounded-md text-white focus:shadow-[0_0_10px_rgba(255,255,255,0.7)] focus:outline-none"
            ref={fileInputRef} // Attach ref to the file input
          />
        </div>

        {/* Stall Position Field */}
        <div>
          <label className="text-white">Stall Position:</label>
          <input
            type="text"
            name="stallPosition"
            value={formData.stallPosition}
            onChange={handleInputChange}
            className="w-full p-2 mt-1 rounded-md placeholder-gray-400 text-black focus:shadow-[0_0_10px_rgba(255,255,255,0.7)] focus:outline-none"
            placeholder="Enter Stall Position (e.g., 'ab1 g1 f10')"
          />
        </div>

        {/* Add Stall Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-[#5f5f60d2] text-white font-semibold p-2 rounded-lg hover:bg-[#292929] transition duration-300"
          >
            Add Stall
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStalls;
