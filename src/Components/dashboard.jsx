import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import AddVolunteer from "../admin_components/AddVolunteer";
import GenerateIDCards from "../admin_components/GenerateIDCards";
import ViewVolunteers from "../admin_components/ViewVolunteers";
import AddStalls from "../admin_components/AddStalls";
import ViewStalls from "../admin_components/ViewStalls";
import UploadPhoto from "../admin_components/UploadPhoto";
import GiveCredits from "../volunteer_components/GiveCredits";

const Dashboard = () => {
  const [role, setRole] = useState("");
  const [activeComponent, setActiveComponent] = useState("View Profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const adminOptions = [
    "Add Volunteer",
    "Generate ID Cards",
    "View Volunteers",
    "Add Stalls",
    "View Stalls",
    "Upload Photo",
  ];

  const coreTeamOptions = [
    "Add Volunteer",
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
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
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
      case "Logout":
        handleLogout();
        return null;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center text-white">
            <img
              src="/logo.png"
              alt="Dashboard Logo"
              className="w-32 h-32 mb-4"
            />
            <h1 className="text-4xl font-bold mb-2">Welcome to Your Dashboard</h1>
            <p className="text-lg mb-6">
              Manage volunteers, stalls, and more with ease!
            </p>
            <div className="flex space-x-4">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
                onClick={() => setActiveComponent(availableOptions[0])}
              >
                Get Started
              </button>
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
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
    <div className="h-screen flex flex-col space-y-4 p-4">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        draggable
      />

      <div className="w-full py-4 shadow-md relative flex items-center justify-between lg:justify-center">
        <h1 className="title font-bold text-3xl text-white">
          VOLUNTEER MANAGEMENT SYSTEM
        </h1>
        <button
          className="lg:hidden text-white p-2 focus:outline-none"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      <hr
        style={{
          width: "calc(100% - 4cm)",
          margin: "0 auto",
          borderColor: "white",
        }}
      />

      <div
        className="flex flex-col lg:flex-row"
        style={{
          width: "calc(100vw - 2cm)",
          height: "calc(100vh - 2cm - 6rem)",
        }}
      >
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
        <div
          className={`bg-white/10 backdrop-blur-lg mt-9 p-6 flex flex-col rounded-xl shadow-lg transform lg:transform-none ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out lg:w-1/5 w-full lg:block fixed lg:static z-20 overflow-y-auto`}
          style={{ maxHeight: "calc(100vh - 9rem)" }}
        >
          <ul className="space-y-2">
            {availableOptions.map((item) => (
              <li
                key={item}
                className={`cursor-pointer px-4 py-3 rounded-lg text-white font-semibold transition-all duration-300 ease-in-out ${
                  activeComponent === item
                    ? "shadow-lg shadow-blue-400"
                    : "hover:bg-gray-800 hover:bg-opacity-50"
                }`}
                onClick={() => {
                  setActiveComponent(item);
                  setIsSidebarOpen(false);
                }}
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="bg-white/15 backdrop-blur-md shadow-lg rounded-lg flex-1"
          style={{
            height: "100%",
            margin: "0.5cm",
            padding: "1cm",
            boxSizing: "border-box",
            overflowY: "scroll",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <div className="text-white">{renderComponent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
