import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUsers,
  FaSchool,
  FaPhoneAlt,
  FaStar,
  FaIdBadge,
} from "react-icons/fa";

const ViewVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    // Fetch volunteers data from the backend API
    const fetchVolunteers = async () => {
      try {
        const authToken = localStorage.getItem("authToken");

        const response = await axios.get("https://tzm-1.onrender.com/api/auth/volunteers", {
          headers: {
            Authorization: `Bearer ${authToken}`, // Send the auth token as a Bearer token
          },
        });
        setVolunteers(response.data.volunteers);
      } catch (error) {
        console.error("Error fetching volunteers:", error);
      }
    };

    fetchVolunteers();
  }, []);

  return (
    <div className="p-4 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen">
      <h2 className="text-3xl font-extrabold text-white mb-6 tracking-tight text-center">
        View Volunteers
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {volunteers.map((volunteer) => (
          <div
            key={volunteer._id}
            className="bg-gradient-to-r from-teal-500 to-blue-600 shadow-xl rounded-lg overflow-hidden transition-transform transform hover:scale-105 duration-300 ease-in-out"
          >
            {/* Image Section */}
            <div className="w-full h-40 sm:h-48 overflow-hidden bg-gray-700 flex items-center justify-center">
              <img
                src={volunteer.photo || "/placeholder.jpg"}
                alt={`${volunteer.name}'s Photo`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            {/* Details Section */}
            <div className="p-4 text-center text-white">
              <h3 className="text-xl font-semibold mb-2">{volunteer.name}</h3>
              <p className="text-xs text-gray-300 mb-4">{volunteer.tzId}</p>
              <div className="text-sm text-gray-200 space-y-2">
                <div className="flex items-center justify-center">
                  <FaIdBadge className="mr-2" />
                  <span>{volunteer.branch}</span>
                </div>
                <div className="flex items-center justify-center">
                  <FaSchool className="mr-2" />
                  <span>{volunteer.year}</span>
                </div>
                <div className="flex items-center justify-center">
                  <FaUsers className="mr-2" />
                  <span>{volunteer.club}</span>
                </div>
                <div className="flex items-center justify-center">
                  <FaPhoneAlt className="mr-2" />
                  <span>{volunteer.phone}</span>
                </div>
                <div className="flex items-center justify-center">
                  <FaStar className="mr-2" />
                  <span>{volunteer.creditScore}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewVolunteers;
