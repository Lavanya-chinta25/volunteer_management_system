import React, { useState } from "react";
import axios from "axios";
import { FaUser, FaPhone, FaUserTag, FaUniversity, FaRegAddressCard } from "react-icons/fa";

const GenerateIDCards = () => {
  const [volunteers, setVolunteers] = useState([]);

  // Fetch volunteers from the backend
  const fetchVolunteers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/volunteers",
        { withCredentials: true }
      );
      setVolunteers(response.data.volunteers);
    } catch (error) {
      console.error("Error fetching volunteers:", error);
    }
  };

  // Generate ID cards
  const generateIDCards = () => {
    volunteers.forEach((volunteer) => {
      const canvas = document.createElement("canvas");
      canvas.width = 600;
      canvas.height = 350;

      const ctx = canvas.getContext("2d");

      // Draw gradient background with border
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#000000");
      gradient.addColorStop(1, "#1e90ff");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 5;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);

      // Add photo (if available)
      if (volunteer.photo) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 20, 20, 100, 100);
        };
        img.src = volunteer.photo;
      } else {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(20, 20, 100, 100);
        ctx.font = "bold 18px Arial";
        ctx.fillStyle = "#000000";
        ctx.fillText("No Photo", 30, 70);
      }

      // Add text details
      ctx.font = "bold 18px Arial";
      ctx.fillStyle = "#ffffff";

      ctx.fillText(`Name: ${volunteer.name}`, 150, 50);
      ctx.fillText(`ID: ${volunteer.tzId}`, 150, 90);
      ctx.fillText(`Role: ${volunteer.role}`, 150, 130);
      ctx.fillText(`Branch: ${volunteer.branch}`, 150, 170);
      ctx.fillText(`Year: ${volunteer.year}`, 150, 210);
      ctx.fillText(`Phone: ${volunteer.phone}`, 150, 250);
      ctx.fillText(`Club: ${volunteer.club}`, 150, 290);

      // Save the canvas as an image
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${volunteer.name}_ID_Card.png`;
      link.click();
    });
  };

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-4">Generate ID Cards</h2>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={fetchVolunteers}
      >
        Fetch Volunteers
      </button>
      {volunteers.length > 0 && (
        <div>
          <h3 className="mt-4 mb-2 text-lg font-semibold">Preview:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {volunteers.map((volunteer) => (
              <div
                key={volunteer._id}
                className="bg-white text-black p-4 rounded-lg shadow-lg flex flex-col items-center"
              >
                <img
                  src={volunteer.photo || "https://via.placeholder.com/100"}
                  alt="Volunteer"
                  className="w-24 h-24 rounded-full mb-2"
                />
                <p className="text-lg font-bold">
                  <FaUser className="inline-block mr-2 text-blue-600" />
                  {volunteer.name}
                </p>
                <p className="text-sm text-gray-700">
                  <FaRegAddressCard className="inline-block mr-2 text-green-600" />
                  ID: {volunteer.tzId}
                </p>
                <p className="text-sm text-gray-700">
                  <FaUserTag className="inline-block mr-2 text-purple-600" />
                  Role: {volunteer.role}
                </p>
                <p className="text-sm text-gray-700">
                  <FaUniversity className="inline-block mr-2 text-yellow-600" />
                  Branch: {volunteer.branch} | Year: {volunteer.year}
                </p>
                <p className="text-sm text-gray-700">
                  <FaPhone className="inline-block mr-2 text-red-600" />
                  Phone: {volunteer.phone}
                </p>
                <p className="text-sm text-gray-700">Club: {volunteer.club}</p>
              </div>
            ))}
          </div>
          <button
            className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={generateIDCards}
          >
            Download ID Cards
          </button>
        </div>
      )}
    </div>
  );
};

export default GenerateIDCards;
