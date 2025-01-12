import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddVolunteer = () => {
  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    year: "",
    club: "",
    role: "",
    phone: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { name, branch, year, club, role, phone } = formData;
  
    // Form Validation
    if (!name || !branch || !year || !club || !role || !phone) {
      toast.error("All fields are required.");
      return;
    }
  
    if (!/^[6-9]\d{9}$/.test(phone)) {
      toast.error("Enter a valid mobile number.");
      return;
    }
  
    try {
      // API call to add a volunteer
      const response = await fetch("http://localhost:5000/api/auth/add", {
          method: "POST",
          credentials: "include", // Includes the authentication cookie
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              name,
              branch,
              year,
              club,
              role,
              phone,
          }),
      });

      if (response.ok) {
          const data = await response.json();
          toast.success("Volunteer added successfully!");
          console.log("Response data:", data);

          // Reset the form fields
          setFormData({
              name: "",
              branch: "",
              year: "",
              club: "",
              role: "",
              phone: "",
          });
      } else {
          const errorData = await response.json();
          toast.error(errorData.message || "Failed to add volunteer.");
      }
  } catch (error) {
      console.error("Error adding volunteer:", error);
      toast.error("An error occurred while adding the volunteer.");
  }
  };
  

  return (
    <div>
      <h2 className="text-2xl font-bold text-white">Add Volunteer</h2>
      <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
        {/* Name Field */}
        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 mt-1 rounded-md placeholder-gray-400 text-black focus:shadow-[0_0_10px_rgba(255,255,255,0.7)] focus:outline-none"
            placeholder="Enter Volunteer Name"
          />
        </div>

        {/* Branch Field */}
        <div>
          <select
            name="branch"
            value={formData.branch}
            onChange={handleInputChange}
            className="w-full p-2 mt-1 rounded-md placeholder-gray-400 text-black focus:shadow-[0_0_10px_rgba(255,255,255,0.7)] focus:outline-none"
          >
            <option value="" disabled hidden>
              Select Branch
            </option>
            <option value="Puc">PUC</option>
            <option value="Cse">CSE</option>
            <option value="Ece">ECE</option>
            <option value="Eee">EEE</option>
            <option value="Civil">Civil</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Chemical">Chemical</option>
            <option value="Metallurgy">Metallurgy</option>
          </select>
        </div>

        {/* Year Field */}
        <div>
          <select
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            className="w-full p-2 mt-1 rounded-md placeholder-gray-400 text-black focus:shadow-[0_0_10px_rgba(255,255,255,0.7)] focus:outline-none"
          >
            <option value="" disabled hidden>
              Select Year
            </option>
            <option value="P1">P1</option>
            <option value="P2">P2</option>
            <option value="E1">E1</option>
            <option value="E2">E2</option>
            <option value="E3">E3</option>
            <option value="E4">E4</option>
          </select>
        </div>

        {/* Club Field */}
        <div>
          <select
            name="club"
            value={formData.club}
            onChange={handleInputChange}
            className="w-full p-2 mt-1 rounded-md placeholder-gray-400 text-black focus:shadow-[0_0_10px_rgba(255,255,255,0.7)] focus:outline-none"
          >
            <option value="" disabled hidden>
              Select Club
            </option>
            <option value="A">A Club</option>
            <option value="B">B Club</option>
            <option value="C">C Club</option>
            <option value="D">D Club</option>
            <option value="E">E Club</option>
            <option value="F">F Club</option>
          </select>
        </div>

        {/* Role Field */}
        <div>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="w-full p-2 mt-1 rounded-md placeholder-gray-400 text-black focus:shadow-[0_0_10px_rgba(255,255,255,0.7)] focus:outline-none"
          >
            <option value="" disabled hidden>
              Select Role
            </option>
            <option value="Admin">Admin</option>
            <option value="Volunteer">Volunteer</option>
            <option value="Core Team">Core Team</option>
          </select>
        </div>

        {/* Phone Number Field */}
        <div>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full p-2 mt-1 rounded-md placeholder-gray-400 text-black focus:shadow-[0_0_10px_rgba(255,255,255,0.7)] focus:outline-none"
            placeholder="Enter Volunteer Phone"
          />
        </div>

        {/* Add Volunteer Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-[#5f5f60d2] text-white p-2 rounded-md hover:bg-[#292929]"
          >
            Add Volunteer
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVolunteer;
