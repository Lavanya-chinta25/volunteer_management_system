import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [tzId, setTzId] = useState(""); // State for Teckzite ID
  const [password, setPassword] = useState(""); // State for password
  const [showButton, setShowButton] = useState(true); // State to manage button visibility
  const navigate = useNavigate();

  // Handles input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "tzId") {
      setTzId(value);
    } else if (name === "password") {
      setPassword(value);
    }
    setShowButton(true); // Show button on input change
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tzId) {
      toast.error("Please enter your Teckzite ID.", { position: "top-center" });
      setShowButton(false);
      return;
    }
    if (!password) {
      toast.error("Please enter your password.", { position: "top-center" });
      setShowButton(false);
      return;
    }
    if (
      !tzId.toUpperCase().startsWith("TZ25V") ||
      isNaN(tzId.slice(5))
    ) {
      toast.error(
        "Teckzite ID must start with 'TZ25V' followed by a number and have a total length of 8 characters.",
        { position: "top-center" }
      );
      setShowButton(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies in the request
        body: JSON.stringify({ tzId: tzId.toUpperCase(), password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userRole", data.role); // Assuming the role is sent in the response
        localStorage.setItem("isAuthenticated", "true");

        toast.success(data.message, { position: "top-center" });
        navigate("/dashboard");// Navigate to dashboard after successful login
      } else {
        toast.error(data.message, { position: "top-center" });
        setShowButton(false);
      }
    } catch (error) {
      toast.error("An error occurred while logging in. Please try again.", {
        position: "top-center",
      });
      setShowButton(false);
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
            name="tzId"
            value={tzId}
            onChange={handleInputChange}
            placeholder="Enter Teckzite ID"
            className="w-full px-4 py-2 mb-4 text-black rounded-lg outline-none focus:ring-2 focus:ring-gray-400"
            style={{ fontFamily: "Poppins, sans-serif" }}
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleInputChange}
            placeholder="Enter Password"
            className="w-full px-4 py-2 mb-4 text-black rounded-lg outline-none focus:ring-2 focus:ring-gray-400"
            style={{ fontFamily: "Poppins, sans-serif" }}
          />
          {showButton && (
            <button
              type="submit"
              className="w-full px-4 py-2 bg-[#5f5f60d2] text-white font-semibold rounded-lg hover:bg-[#292929]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Login
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
