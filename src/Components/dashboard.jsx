import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddVolunteer from "../admin_components/AddVolunteer";
import GenerateIDCards from "../admin_components/GenerateIDCards";
import ViewVolunteers from "../admin_components/ViewVolunteers";
import ViewProfile from "../admin_components/ViewProfile";
import AddStalls from "../admin_components/AddStalls";
import ViewStalls from "../admin_components/ViewStalls";

const Dashboard = () => {
  const [role, setRole] = useState("");
  const [activeComponent, setActiveComponent] = useState("View Profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole"); // Fetch role from local storage
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const adminOptions = [
    "Add Volunteer",
    "Generate ID Cards",
    "View Volunteers",
    "View Profile",
    "Add Stalls",
    "View Stalls"
  ];

  const coreTeamOptions = [
    "Add Volunteer",
    "View Volunteers",
    "View Profile",
    "Add Stalls",
    "View Stalls"
  ];

  const volunteerOptions = ["View Profile", "Add Stalls","View Stalls"];

  const availableOptions =
    role === "Admin"
      ? adminOptions
      : role === "Core Team"
      ? coreTeamOptions
      : volunteerOptions;

  const renderComponent = () => {
    switch (activeComponent) {
      case "Add Volunteer":
        return <AddVolunteer />;
      case "Generate ID Cards":
        return <GenerateIDCards />;
      case "View Volunteers":
        return <ViewVolunteers />;
      case "View Profile":
        return <ViewProfile />;
      case "Add Stalls":
        return <AddStalls />;
      case "View Stalls":
        return <ViewStalls/>
      default:
        return <div>Welcome to your Dashboard!</div>;
    }
  };

  const roleSpecificText =
    role === "Admin"
      ? "Admin Options"
      : role === "Core Team"
      ? "Core Team Options"
      : "Volunteer Options";

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

      {/* Header */}
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
        {/* Sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
        <div
          className={`bg-white/10 backdrop-blur-lg mt-9 p-6 flex flex-col rounded-xl shadow-lg transform lg:transform-none ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out lg:w-1/5 w-full lg:block fixed lg:static z-20`}
        >
          {/*<div className="text-center text-white font-semibold text-lg mb-4">
            {roleSpecificText}
          </div> */}
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
                  setIsSidebarOpen(false); // Close sidebar after selection
                }}
              >
                {item}
              </li>
            ))}
          </ul>
          {/* 
          <div className="text-center text-white font-light text-sm mt-4">
            End of Options
          </div>*/}
        </div>

        {/* Main Content */}
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
