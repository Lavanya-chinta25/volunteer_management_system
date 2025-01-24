import React, { useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddCoreTeam = () => {
  const [formData, setFormData] = useState({
    memberName: "",
    memberImage: null,
    memberPosition: "",
  });

  const fileInputRef = useRef(null); // Ref for the file input

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "memberImage" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });

    const { memberName, memberImage, memberPosition } = formData;

    if (!memberName || !memberImage || !memberPosition) {
      toast.error("All fields are required.");
      return;
    }

    // Prepare form data for the request
    const formDataPayload = new FormData();
    formDataPayload.append("name", memberName);
    formDataPayload.append("image", memberImage);
    formDataPayload.append("position", memberPosition);

    try {
      // Get the auth token from localStorage
      const authToken = localStorage.getItem("authToken");

      // Send POST request to backend with Bearer token
      const response = await axios.post(
        "https://tzm-1.onrender.com/api/coreteam", // Backend endpoint for core team
        formDataPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`, // Add token in Authorization header
          },
        }
      );

      toast.success("Core team member added successfully!");
      console.log("Response:", response.data);

      // Reset form and clear file input
      setFormData({
        memberName: "",
        memberImage: null,
        memberPosition: "",
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear the file input value
      }
    } catch (error) {
      console.error("Error adding core team member:", error.response || error);
      toast.error("Failed to add core team member. Please try again.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white">Add Core Team Member</h2>
      <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
        {/* Member Name Field */}
        <div>
          <label className="text-white">Member Name:</label>
          <input
            type="text"
            name="memberName"
            value={formData.memberName}
            onChange={handleInputChange}
            className="w-full p-2 mt-1 rounded-md placeholder-gray-400 text-black focus:shadow-[0_0_10px_rgba(255,255,255,0.7)] focus:outline-none"
            placeholder="Enter Member Name"
          />
        </div>

        {/* Image Upload Field */}
        <div>
          <label className="text-white">Member Image:</label>
          <input
            type="file"
            name="memberImage"
            accept="image/*"
            onChange={handleInputChange}
            className="w-full p-2 mt-1 rounded-md text-white focus:shadow-[0_0_10px_rgba(255,255,255,0.7)] focus:outline-none"
            ref={fileInputRef} // Attach ref to the file input
          />
        </div>

        {/* Member Position Field */}
        <div>
          <label className="text-white">Member Position:</label>
          <input
            type="text"
            name="memberPosition"
            value={formData.memberPosition}
            onChange={handleInputChange}
            className="w-full p-2 mt-1 rounded-md placeholder-gray-400 text-black focus:shadow-[0_0_10px_rgba(255,255,255,0.7)] focus:outline-none"
            placeholder="Enter Member Position"
          />
        </div>

        {/* Add Member Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-[#5f5f60d2] text-white font-semibold p-2 rounded-lg hover:bg-[#292929] transition duration-300"
          >
            Add Member
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCoreTeam;
