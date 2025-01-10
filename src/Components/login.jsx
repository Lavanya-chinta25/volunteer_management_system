import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { toast } from "react-toastify"; // Import the toast function
import "react-toastify/dist/ReactToastify.css"; // Import the styles

const Login = () => {
  const [teckziteId, setTeckziteId] = useState(""); // State for Teckzite ID input
  const navigate = useNavigate(); // Hook to navigate to Dashboard on success

  // Handle input change
  const handleInputChange = (e) => {
    setTeckziteId(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if ID starts with "tz25v" and has a length of 8
    if (!teckziteId) {
      toast.error("Please enter your Teckzite ID.", { position: "top-center" });
      setTeckziteId(""); // Reset the input field
    } else if (teckziteId.length !== 8 || !teckziteId.toLowerCase().startsWith("tz25v") || isNaN(teckziteId.slice(5))) {
      toast.error("Teckzite ID must start with 'tz25v' followed by a number and have a total length of 8 characters.", { position: "top-center" });
      setTeckziteId(""); // Reset the input field
    } else {
      // Success - Navigate to Dashboard
      toast.success("Login Successful!", { position: "top-center" });
      navigate("/dashboard"); // Assuming '/dashboard' is the route for the dashboard component
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div
        className="glassmorphic-bg px-8 py-10 rounded-lg shadow-lg w-80 text-center"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        <h2 className="text-2xl font-bold text-white mb-6">Welcome</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={teckziteId}
            onChange={handleInputChange}
            placeholder="Enter Teckzite ID"
            className="w-full px-4 py-2 mb-4 text-black rounded-lg outline-none focus:ring-2 focus:ring-gray-400"
            style={{ fontFamily: "Poppins, sans-serif" }}
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-[#5f5f60d2] text-white font-semibold rounded-lg hover:bg-[#292929]"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
