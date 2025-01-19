import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Uploadphoto = () => {
  const [photo, setPhoto] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photo) {
      toast.error("Please upload a photo.");
      return;
    }

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append("photo", photo);

    try {
      const response = await fetch("http://localhost:5000/api/auth/upload-photo", {
        method: "POST",
        credentials: "include", // Includes the authentication cookie
        body: formData, // Attach the photo
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Photo uploaded successfully!");
      } else {
        toast.error(data.message || "Failed to upload photo.");
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error("An error occurred. Please try again.");
    }

    // Reset photo field
    setPhoto(null);
    e.target.reset(); // Reset file input to show "No file chosen"
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white">Upload Photo</h2>
      <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
        {/* Upload Photo Field */}
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="w-full p-2 mt-1 rounded-md placeholder-gray-400 text-white focus:shadow-[0_0_10px_rgba(255,255,255,0.7)] focus:outline-none"
          />
        </div>

        {/* Upload Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-[#5f5f60d2] text-white p-2 rounded-md hover:bg-[#1d1d1d]"
          >
            Upload Photo
          </button>
        </div>
      </form>
    </div>
  );
};

export default Uploadphoto;
