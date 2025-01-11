import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [teckziteId, setTeckziteId] = useState(""); 
  const navigate = useNavigate(); 

  const handleInputChange = (e) => {
    setTeckziteId(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // "tz25v" and length 8
    if (!teckziteId) {
      toast.error("Please enter your Teckzite ID.", { position: "top-center" });
      setTeckziteId(""); 
    } 
    else if (teckziteId.length !== 8 || !teckziteId.toLowerCase().startsWith("tz25v") || isNaN(teckziteId.slice(5))) {
      toast.error("Teckzite ID must start with 'tz25v' followed by a number and have a total length of 8 characters.", { position: "top-center" });
      setTeckziteId(""); 
    }
     else {
      toast.success("Login Successful!", { position: "top-center" });
      navigate("/dashboard");
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