import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Background from './Components/background';
import Login from './Components/login';
import AdminDashboard from './Components/admin_dashboard';
import VolunteerDashboard from './Components/volunteer_dashboard';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [role, setRole] = useState(null); // State to store the user's role
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track if the user is authenticated

  // Simulate fetching user role from localStorage or API
  useEffect(() => {
    const fetchUserRole = async () => {
      // Fetch user role and authentication status from localStorage
      const storedRole = localStorage.getItem("userRole");
      const isLoggedIn = localStorage.getItem("isAuthenticated");

      // Check if the user is authenticated and role exists
      if (storedRole && isLoggedIn === "true") {
        setRole(storedRole);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    fetchUserRole();
  }, []);

  // Conditional rendering based on role
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
            {/* Login route */}
            <Route path="/" element={<Login />} />
            {/* Protected Dashboard route */}
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
