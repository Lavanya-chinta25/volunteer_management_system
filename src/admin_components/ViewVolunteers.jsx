import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaSchool, FaPhoneAlt, FaStar, FaIdBadge } from "react-icons/fa";

const ViewVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    // Fetch volunteers data from the backend API
    axios
      .get("http://localhost:5000/api/auth/volunteers", { withCredentials: true })
      .then((response) => {
        setVolunteers(response.data.volunteers);
      })
      .catch((error) => {
        console.error("Error fetching volunteers:", error);
      });
  }, []);

  return (
    <div className="p-8 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen">
      <h2 className="text-4xl font-extrabold text-white mb-8 tracking-tight">View Volunteers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {volunteers.map((volunteer) => (
          <div
            key={volunteer._id}
            className="bg-gradient-to-r from-teal-500 to-blue-600 shadow-2xl rounded-xl overflow-hidden transform hover:scale-105 transition duration-300 ease-in-out"
          >
            <div className="w-full h-48 overflow-hidden rounded-t-xl">
              <img
                src={volunteer.photo || "/placeholder.jpg"}
                alt={`${volunteer.name}'s Photo`}
                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-all"
              />
            </div>
            <div className="p-6 text-center text-white">
              <h3 className="text-2xl font-semibold text-gray-100 mb-2">{volunteer.name}</h3>
              <p className="text-xs text-gray-300 mb-4">{volunteer.tzId}</p>
            </div>
            <div className="px-6 py-4 bg-gray-900 rounded-b-xl">
              <div className="grid grid-cols-1 gap-4">
                {/* Branch */}
                <div className="flex items-center text-gray-200">
                  <FaIdBadge className="mr-3 text-lg" />
                  <div className="font-medium text-sm text-gray-300">Branch:</div>
                  <div className="ml-2 text-sm text-gray-100">{volunteer.branch}</div>
                </div>
                {/* Year */}
                <div className="flex items-center text-gray-200">
                  <FaSchool className="mr-3 text-lg" />
                  <div className="font-medium text-sm text-gray-300">Year:</div>
                  <div className="ml-2 text-sm text-gray-100">{volunteer.year}</div>
                </div>
                {/* Club */}
                <div className="flex items-center text-gray-200">
                  <FaUsers className="mr-3 text-lg" />
                  <div className="font-medium text-sm text-gray-300">Club:</div>
                  <div className="ml-2 text-sm text-gray-100">{volunteer.club}</div>
                </div>
                {/* Phone */}
                <div className="flex items-center text-gray-200">
                  <FaPhoneAlt className="mr-3 text-lg" />
                  <div className="font-medium text-sm text-gray-300">Phone:</div>
                  <div className="ml-2 text-sm text-gray-100">{volunteer.phone}</div>
                </div>
                {/* Credit Score */}
                <div className="flex items-center text-gray-200">
                  <FaStar className="mr-3 text-lg" />
                  <div className="font-medium text-sm text-gray-300">Credit Score:</div>
                  <div className="ml-2 text-sm text-gray-100">{volunteer.creditScore}</div>
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
