import React, { useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddTeam = () => {
  const [formData, setFormData] = useState({
    teamName: "",
    teamImage: null,
    teamType: "",
  });

  const fileInputRef = useRef(null); // Ref for the file input

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "teamImage" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });

    const { teamName, teamImage, teamType } = formData;

    if (!teamName || !teamImage || !teamType) {
      toast.error("All fields are required.");
      return;
    }

    // Prepare form data for the request
    const formDataPayload = new FormData();
    formDataPayload.append("name", teamName);
    formDataPayload.append("image", teamImage);
    formDataPayload.append("type", teamType);

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

      toast.success("Team added successfully!");
      console.log("Response:", response.data);

      // Reset form and clear file input
      setFormData({
        teamName: "",
        teamImage: null,
        teamType: "",
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear the file input value
      }
    } catch (error) {
      console.error("Error adding team:", error.response || error);
      toast.error("Failed to add team. Please try again.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white">Add Team</h2>
      <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
        {/* Team Name Field */}
        <div>
          <label className="text-white">Team Name:</label>
          <input
            type="text"
            name="teamName"
            value={formData.teamName}
            onChange={handleInputChange}
            className="w-full p-2 mt-1 rounded-md placeholder-gray-400 text-black focus:shadow-[0_0_10px_rgba(255,255,255,0.7)] focus:outline-none"
            placeholder="Enter Team Name"
          />
        </div>

        {/* Image Upload Field */}
        <div>
          <label className="text-white">Team Image:</label>
          <input
            type="file"
            name="teamImage"
            accept="image/*"
            onChange={handleInputChange}
            className="w-full p-2 mt-1 rounded-md text-white focus:shadow-[0_0_10px_rgba(255,255,255,0.7)] focus:outline-none"
            ref={fileInputRef} // Attach ref to the file input
          />
        </div>

        {/* Team Position Field */}
        <div>
          <label className="text-white">Team Position:</label>
          <input
            type="text"
            name="teamType"
            value={formData.teamType}
            onChange={handleInputChange}
            className="w-full p-2 mt-1 rounded-md placeholder-gray-400 text-black focus:shadow-[0_0_10px_rgba(255,255,255,0.7)] focus:outline-none"
            placeholder="Enter Team Position"
          />
        </div>

        {/* Add Team Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-[#5f5f60d2] text-white font-semibold p-2 rounded-lg hover:bg-[#292929] transition duration-300"
          >
            Add Team
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTeam;
