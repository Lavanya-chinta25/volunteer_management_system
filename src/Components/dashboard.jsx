import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaStore, FaUsersCog, FaHandHoldingUsd, FaIdCard, FaUpload, FaSignOutAlt } from "react-icons/fa";
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
  const [activeMain, setActiveMain] = useState("Volunteers");
  const [activeSub, setActiveSub] = useState("View Volunteers");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/");
    } else {
      setRole(storedRole);
    }
  }, [navigate]);

  const sidebarItems = [
    { 
      name: "Volunteers", 
      icon: <FaUsers />, 
      sub: ["Add Volunteers", "View Volunteers"] 
    },
    { 
      name: "Stalls", 
      icon: <FaStore />, 
      sub: ["Add Stalls", "View Stalls"] 
    },
    { 
      name: "Team", 
      icon: <FaUsersCog />, 
      sub: ["Add Coreteam", "View Coreteam", "Add Team", "View Team"] 
    },
    { 
      name: "Sponsors", 
      icon: <FaHandHoldingUsd />, 
      sub: ["Add Sponsors", "View Sponsors"] 
    },
    { 
      name: "Generate ID Cards", 
      icon: <FaIdCard />, 
      sub: [] 
    },
    { 
      name: "Upload Photo", 
      icon: <FaUpload />, 
      sub: [] 
    },
    { 
      name: "Logout", 
      icon: <FaSignOutAlt />, 
      sub: [] 
    }
  ];

  const handleMainClick = (main) => {
    setActiveMain(main);
    if (sidebarItems.find((item) => item.name === main)?.sub.length > 0) {
      setActiveSub(sidebarItems.find((item) => item.name === main)?.sub[0]);
    } else {
      setActiveSub(main);
    }
  };

  const handleSubClick = (sub) => {
    setActiveSub(sub);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };
    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  const renderComponent = () => {
    const components = {
      "Add Volunteers": <AddVolunteer />,
      "Generate ID Cards": <GenerateIDCards />,
      "View Volunteers": <ViewVolunteers />,
      "Add Stalls": <AddStalls />,
      "View Stalls": <ViewStalls />,
      "Upload Photo": <UploadPhoto />,
      "Give Credits": <GiveCredits />,
      "Add Team": <AddTeam />,
      "View Team": <Viewteams />,
      "View Sponsors": <Viewsponsors />,
      "Add Sponsors": <Addsponsor />,
      "View Coreteam": <Viewcoreteam />,
      "Add Coreteam": <AddCoreTeam />,
    };
    return activeSub === "Logout" ? handleLogout() : components[activeSub] || <h2>Welcome to Dashboard</h2>;
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="w-screen h-screen bg-gray-900 text-white flex flex-col overflow-hidden">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar newestOnTop />

      {/* Header */}
      <header className="w-full bg-gray-800 p-4 flex justify-center items-center fixed top-0 left-0 z-50">
        <h1 className="text-xl font-bold text-center w-full">VOLUNTEER MANAGEMENT SYSTEM</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden absolute right-4 text-xl">
          {isSidebarOpen ? "✖" : "⋮"}
        </button>
      </header>

      {/* Main Content: Sidebar + Container */}
      <div className="flex flex-1 w-full h-full pt-16">
        
        {/* Sidebar */}
        <nav
        ref={sidebarRef}
        style={{
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE/Edge
        }}
        className={`w-64 bg-gray-800 p-4 fixed left-0 top-16 bottom-0 overflow-y-auto transform transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static z-40`}>
          <ul>
            {sidebarItems.map((item) => (
              <li key={item.name}>
                <div 
                  className={`flex m-2 items-center p-2 font-semibold cursor-pointer rounded-lg ${activeMain === item.name ? "bg-[#12479685] bg-opacity-30 shadow-lg shadow-blue-500/50" : "hover:bg-gray-700"}`}
                  onClick={() => handleMainClick(item.name)}
                >
                  {item.icon}
                  <span className="ml-2">{item.name.toUpperCase()}</span>
                </div>
                {activeMain === item.name && item.sub.length > 0 && (
                  <ul className="ml-6 mt-2">
                    {item.sub.map((sub) => (
                      <li
                        key={sub}
                        className={`p-1 cursor-pointer flex items-center ${activeSub === sub ? "text-blue-400 font-semibold" : "hover:text-gray-400"}`}
                        onClick={() => handleSubClick(sub)}
                      >
                        {activeSub === sub && <span className="mr-0"></span>}
                        {sub}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Component Container */}
        <main 
        style={{
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE/Edge
        }}
        className="flex-1 p-6 bg-gray-900 ml-4 overflow-auto">
          {renderComponent()}
        </main>

      </div>
    </div>
  );
};

export default Dashboard;
