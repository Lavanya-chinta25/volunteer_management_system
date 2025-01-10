import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Background from './Components/background';
import Login from './Components/login';
import Dashboard from './Components/dashboard';
import { ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

function App() {
  return (
    <Router>
      <div className="relative h-screen w-screen"> 
        <Background />
        <div className="absolute inset-0 z-10 flex justify-center items-center">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
        
        <ToastContainer 
          position="top-center" 
          autoClose={5000} 
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
