import React, { useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Addsponsor = () => {
  const [formData, setFormData] = useState({
    sponsorName: "",
    sponsorImage: null,
    sponsorType: "",
  });

  const fileInputRef = useRef(null); // Ref for the file input

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "sponsorImage" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });

    const { sponsorName, sponsorImage, sponsorType } = formData;

    if (!sponsorName || !sponsorImage || !sponsorType) {
      toast.error("All fields are required.");
      return;
    }

    // Prepare form data for the request
    const formDataPayload = new FormData();
    formDataPayload.append("name", sponsorName);
    formDataPayload.append("image", sponsorImage);
    formDataPayload.append("type", sponsorType);

    try {
      // Send POST request to backend
      const response = await axios.post(
        "http://localhost:5000/api/sponsors", // Backend endpoint
        formDataPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // Include cookies for authentication
        }
      );

      toast.success("sponsor added successfully!");
      console.log("Response:", response.data);

      // Reset form and clear file input
      setFormData({
        sponsorName: "",
        sponsorImage: null,
        sponsorType: "",
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear the file input value
      }
    } catch (error) {
      console.error("Error adding sponsor:", error.response || error);
      toast.error("Failed to add sponsor. Please try again.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white">Add sponsor</h2>
      <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
        {/* sponsor Name Field */}
        <div>
          <label className="text-white">sponsor Name:</label>
          <input
            type="text"
            name="sponsorName"
            value={formData.sponsorName}
            onChange={handleInputChange}
            className="w-full p-2 mt-1 rounded-md placeholder-gray-400 text-black focus:shadow-[0_0_10px_rgba(255,255,255,0.7)] focus:outline-none"
            placeholder="Enter sponsor Name"
          />
        </div>

        {/* Image Upload Field */}
        <div>
          <label className="text-white">sponsor Image:</label>
          <input
            type="file"
            name="sponsorImage"
            accept="image/*"
            onChange={handleInputChange}
            className="w-full p-2 mt-1 rounded-md text-white focus:shadow-[0_0_10px_rgba(255,255,255,0.7)] focus:outline-none"
            ref={fileInputRef} // Attach ref to the file input
          />
        </div>

        {/* sponsor Type Field */}
        <div>
          <label className="text-white">Sponsor Type:</label>
          <input
            type="text"
            name="sponsorType"
            value={formData.sponsorType}
            onChange={handleInputChange}
            className="w-full p-2 mt-1 rounded-md placeholder-gray-400 text-black focus:shadow-[0_0_10px_rgba(255,255,255,0.7)] focus:outline-none"
            placeholder="Enter sponsor Position"
          />
        </div>

        {/* Add sponsor Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-[#5f5f60d2] text-white font-semibold p-2 rounded-lg hover:bg-[#292929] transition duration-300"
          >
            Add sponsor
          </button>
        </div>
      </form>
    </div>
  );
};

export default Addsponsor;
