import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaCoins, FaUserCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const GiveCredits = () => {
  const [tzId, setTzId] = useState("");
  const [credits, setCredits] = useState(50);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tzId) {
      toast.error("Teckzite ID is required.", { position: "top-center" });
      return;
    }

    try {
      const response = await fetch(
        "https://teckzitebackend-apr6.onrender.com/user/addcredits",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tzkid: tzId, creditCount: credits }),
        }
      );
      console.log(response);

      if (response.ok) {
        toast.success("Credits added successfully!", { position: "top-center" });
        setTzId("");
      } else {
        toast.error("Failed to add credits. Please try again.", {
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.", {
        position: "top-center",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full text-center text-white"
      style={{
        background: "linear-gradient(135deg, rgba(30, 144, 255, 0.5), rgba(0, 0, 0, 0.8))",
        borderRadius: "20px",
        padding: "2rem",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.7)",
      }}
    >
      <motion.h2
        className="text-4xl font-bold mb-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{ color: "#ffffff" }}
      >
        Add Credits
      </motion.h2>
      <form
        className="space-y-6 w-3/4"
        onSubmit={handleSubmit}
        style={{ maxWidth: "400px" }}
      >
        <div className="relative flex items-center">
          <motion.div
            initial={{ scale: 1 }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-3 text-blue-500 text-xl"
          >
            <FaUserCircle />
          </motion.div>
          <input
            type="text"
            className="w-full pl-12 pr-4 py-3 text-black rounded-lg border border-gray-600 bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Teckzite ID"
            value={tzId}
            onChange={(e) => setTzId(e.target.value)}
            required
          />
        </div>
        <div className="relative flex items-center">
          <motion.div
            initial={{ scale: 1 }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, -15, 15, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-3 text-yellow-500 text-xl"
          >
            <FaCoins />
          </motion.div>
          <input
            type="number"
            className="w-full pl-12 pr-4 py-3 text-black rounded-lg border border-gray-600 bg-white/90 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Enter Credits"
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
            required
            min={50}
          />
        </div>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg"
        >
          Add Credits
        </motion.button>
      </form>
    </motion.div>
  );
};

export default GiveCredits;
