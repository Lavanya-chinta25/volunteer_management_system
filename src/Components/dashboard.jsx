import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import AddVolunteer from "../admin_components/AddVolunteer";
import GenerateIDCards from "../admin_components/Generate";
import ViewVolunteers from "../admin_components/ViewVolunteers";
import AddStalls from "../admin_components/AddStalls";
import ViewStalls from "../admin_components/ViewStalls";
import UploadPhoto from "../admin_components/UploadPhoto";
import GiveCredits from "../volunteer_components/GiveCredits";
import AddTeam from "../admin_components/AddTeam";
import Viewteams from "../admin_components/ViewTeams";
import Viewsponsors from "../admin_components/ViewSponsors";
import Addsponsor from "../admin_components/AddSponsors";
import Viewcoreteam from "../admin_components/ViewCoreTeams";
import AddCoreTeam from "../admin_components/AddCoreTeam";

const Dashboard = () => {
  const [role, setRole] = useState("");
  const [activeComponent, setActiveComponent] = useState("View Profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      navigate("/");
    } else {
      setRole(storedRole);
    }
  }, [navigate]);

  const adminOptions = [
    "Add Volunteer",
    "View CoreTeam",
    "Add CoreTeam",
    "Generate ID Cards",
    "View Volunteers",
    "Add Stalls",
    "View Stalls",
    "Add Team",
    "Upload Photo",
    "View Sponsors",
    "Add Sponsors",
    "View Teams",
  ];

  const coreTeamOptions = [
    "Add Volunteer",
    "Generate ID Cards",
    "View Volunteers",
    "Upload Photo",
    "Add Stalls",
    "View Stalls",
  ];

  const volunteerOptions = [
    "Upload Photo",
    "Add Stalls",
    "View Stalls",
    "Give Credits",
  ];

  const availableOptions = [
    ...(role === "Admin"
      ? adminOptions
      : role === "Core Team"
      ? coreTeamOptions
      : volunteerOptions),
    "Logout",
  ];

  const handleLogout = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch("https://tzm-1.onrender.com/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        localStorage.clear();
        toast.success("Logged out successfully", { position: "top-center" });
        navigate("/");
      } else {
        toast.error("Failed to log out. Please try again.", {
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error("An error occurred during logout.", { position: "top-center" });
    }
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "Add Volunteer":
        return <AddVolunteer />;
      case "Generate ID Cards":
        return <GenerateIDCards />;
      case "View Volunteers":
        return <ViewVolunteers />;
      case "Add Stalls":
        return <AddStalls />;
      case "View Stalls":
        return <ViewStalls />;
      case "Upload Photo":
        return <UploadPhoto />;
      case "Give Credits":
        return <GiveCredits />;
      case "Add Team":
        return <AddTeam />;
      case "View Teams":
        return <Viewteams />;
      case "View Sponsors":
        return <Viewsponsors />;
      case "Add Sponsors":
        return <Addsponsor />;
      case "View CoreTeam":
        return <Viewcoreteam />;
      case "Add CoreTeam":
        return <AddCoreTeam />;
      case "Logout":
        handleLogout();
        return null;
      default:
        return (
          <div className="bg-black/30 backdrop-blur-lg rounded-lg shadow-lg mx-auto p-4 md:p-8 w-[95%] md:w-[600px] min-h-[350px] flex flex-col justify-center items-center">
            <h1 className="text-2xl md:text-4xl font-bold mb-2 text-center break-words px-2">TECKZITE 2k25</h1>
            <h3 className="text-xl md:text-3xl font-bold mb-2 text-center break-words px-2">Welcome to Your Dashboard</h3>
            <p className="text-sm md:text-lg mb-6 text-center px-2">
              Manage volunteers, stalls, and more with ease!
            </p>
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full px-4 md:px-0 md:w-auto">
              <button
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md text-sm md:text-base whitespace-nowrap"
                onClick={() => setActiveComponent(availableOptions[0])}
              >
                Get Started
              </button>
              <button
                className="w-full md:w-auto bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md text-sm md:text-base whitespace-nowrap"
                onClick={() => setIsSidebarOpen(true)}
              >
                Explore Options
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col space-y-2 md:space-y-4 p-2 md:p-4">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        draggable
      />

      {/* Header */}
      <div className="w-full py-2 md:py-4 shadow-md relative flex items-center justify-between lg:justify-center px-3 md:px-6">
        <div className="flex items-center justify-center w-full lg:w-auto">
          <h1 className="title font-bold text-lg md:text-3xl text-white text-center break-words">
            VOLUNTEER MANAGEMENT SYSTEM
          </h1>
        </div>
        <button
          className="lg:hidden text-white p-2 focus:outline-none flex-shrink-0 absolute right-3"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      <hr className="w-[95%] md:w-[calc(100%-4cm)] mx-auto border-white" />

      <div className="flex flex-col lg:flex-row w-full lg:w-[calc(100vw-2cm)] h-[calc(100vh-6rem)] md:h-[calc(100vh-2cm-6rem)]">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
        
        {/* Sidebar */}
        <div
          className={`bg-white/10 backdrop-blur-lg mt-2 md:mt-9 p-4 flex flex-col rounded-xl shadow-lg transform lg:transform-none ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out lg:w-1/5 w-[85%] md:w-full lg:block fixed lg:static z-20 overflow-y-auto h-full lg:h-auto`}
        >
          <ul className="space-y-2">
            {availableOptions.map((item) => (
              <li
                key={item}
                className={`cursor-pointer px-3 md:px-4 py-2 md:py-3 rounded-lg text-white font-semibold transition-all duration-300 ease-in-out text-sm md:text-base ${
                  activeComponent === item
                    ? "shadow-lg shadow-blue-400"
                    : "hover:bg-gray-800 hover:bg-opacity-50"
                }`}
                onClick={() => {
                  setActiveComponent(item);
                  setIsSidebarOpen(false);
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="bg-white/15 backdrop-blur-md shadow-lg rounded-lg flex-1 m-2 md:m-4 p-3 md:p-8 overflow-y-auto">
          <div className="text-white">{renderComponent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;