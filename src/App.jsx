import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Background from "./Components/background";
import Login from "./Components/login";
import AdminDashboard from "./Components/admin_dashboard";
import VolunteerDashboard from "./Components/volunteer_dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [role, setRole] = useState(localStorage.getItem("userRole") || null); // Initial role from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  ); // Initial authentication status

  // Update state whenever localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const storedRole = localStorage.getItem("userRole");
      const isLoggedIn = localStorage.getItem("isAuthenticated") === "true";

      setRole(storedRole);
      setIsAuthenticated(isLoggedIn);
    };

    // Listen for localStorage changes (e.g., from login/logout)
    window.addEventListener("storage", handleStorageChange);

    // Clean up the event listener
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Render the appropriate dashboard based on role
  const renderDashboard = () => {
    if (role === "Admin" || role === "Coordinator") {
      return <AdminDashboard />;
    } else if (role === "Volunteer") {
      return <VolunteerDashboard />;
    } else {
      return <Navigate to="/" />;
    }
  };

  return (
    <Router>
      <div className="relative h-screen w-screen">
        <Background />
        <div className="absolute inset-0 z-10 flex justify-center items-center">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/dashboard"
              element={isAuthenticated ? renderDashboard() : <Navigate to="/" />}
            />
          </Routes>
        </div>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
        />
      </div>
    </Router>
  );
}

export default App;
