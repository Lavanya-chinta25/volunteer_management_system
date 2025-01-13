import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddVolunteer from "../admin_components/AddVolunteer";
import GenerateIDCards from "../admin_components/GenerateIDCards";
import ViewVolunteers from "../admin_components/ViewVolunteers";
import ViewProfile from "../admin_components/ViewProfile";
import AddStalls from "../admin_components/AddStalls";
import Sidebar from "./volunteer_sidebar"; // Import Sidebar component

const Dashboard = () => {
  const [role, setRole] = useState("");
  const [activeComponent, setActiveComponent] = useState("Add Volunteer");
  const [showSidebar, setShowSidebar] = useState(false); // State for sidebar visibility

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

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
      default:
        return <div>Welcome to your Dashboard!</div>;
    }
  };

  // Overlay sidebar for smaller devices
  const mobileSidebar = (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex">
      <div
        className="bg-white/10 backdrop-blur-lg w-3/4 h-full p-6 flex flex-col rounded-xl space-y-4"
        style={{ backdropFilter: "blur(10px)", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)" }}
      >
        <button
          className="text-white text-2xl mb-4 self-end"
          onClick={() => setShowSidebar(false)}
        >
          ✖
        </button>
        <ul className="space-y-4">
          {["Add Volunteer", "Generate ID Cards", "View Volunteers", "View Profile", "Add Stalls"].map(
            (item) => (
              <li
                key={item}
                className={`cursor-pointer p-4 rounded-lg text-white font-semibold transition-all duration-300 ease-in-out
                  ${activeComponent === item ? "shadow-lg shadow-blue-400" : "hover:bg-gray-800 hover:bg-opacity-50"}`}
                onClick={() => {
                  setActiveComponent(item);
                  setShowSidebar(false);
                }}
              >
                {item}
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col space-y-4 p-4">
      {/* ToastContainer at the top level */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        draggable
      />

      <div className="w-full py-4 shadow-md relative flex items-center justify-center">
        <button
          className="hamburger-menu absolute left-4 top-1/2 transform -translate-y-1/2 text-white lg:hidden"
          onClick={() => setShowSidebar(true)}
        >
          ☰
        </button>
        <h1 className="title font-bold text-3xl text-white">
          VOLUNTEER MANAGEMENT SYSTEM
        </h1>
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
          width: `calc(100vw - 2cm)`,
          height: `calc(100vh - 2cm - 6rem)`,
        }}
      >
        {/* Sidebar for larger screens */}
        <Sidebar
          activeComponent={activeComponent}
          setActiveComponent={setActiveComponent}
          setShowSidebar={setShowSidebar}
        />

        {/* Overlay Sidebar for smaller devices */}
        {showSidebar && mobileSidebar}

        {/* Main Content */}
        <div
          className="bg-white/15 backdrop-blur-md shadow-lg rounded-lg flex-1"
          style={{
            height: `100%`,
            margin: "0.5cm",
            marginBottom: "0cm",
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
