import React from "react";
import { Box } from "@mui/material";
import HeroBg from "../assets/HeroBg.png"; // Adjust the path if needed

const HeroScreen = () => {
  return (
    <Box className="flex flex-col items-center justify-start w-full min-h-screen text-center">

      {/* Heading Section */}
      <h1 className="text-3xl pt-2 md:text-4xl font-bold text-white mt-6">
        Welcome to the Volunteer Management System
      </h1>

      {/* Image Section */}
      <img
        src={HeroBg}
        alt="Hero Background"
        className="w-full object-contain h-60 md:h-[50vh] lg:h-[60vh]"
       />


      {/* Text Section */}
      <p className="text-lg text-white mt-4 px-6 md:px-12">
        Manage volunteers, stalls, teams, sponsors, and more efficiently.
      </p>
    </Box>
  );
};

export default HeroScreen;
