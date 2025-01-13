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

  // Simulate fetching user role from an API or local storage
  useEffect(() => {
    const fetchUserRole = async () => {
      // Replace this with actual API call or localStorage/sessionStorage logic
      const storedRole = localStorage.getItem("userRole"); // Example: "Admin" or "Coordinator"
      console.log(storedRole)
      const isLoggedIn = localStorage.getItem("isAuthenticated"); // Example: "true"
      
      if (storedRole && isLoggedIn === "true") {
        setRole(storedRole);
        setIsAuthenticated(true);
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
          progress={undefined}
        />
      </div>
    </Router>
  );
}

export default App;
