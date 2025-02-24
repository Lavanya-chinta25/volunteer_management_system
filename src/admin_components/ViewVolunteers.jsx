import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPhoneAlt, FaStar, FaIdBadge, FaUsers, FaEdit, FaTrash, FaFileExcel } from "react-icons/fa";
import { toast } from "react-toastify";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import * as XLSX from 'xlsx';

const ViewVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [updateData, setUpdateData] = useState({ name: "", phone: "", branch: "", club: "", creditScore: "" });
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get("https://tzm-1.onrender.com/api/auth/volunteers", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      console.log(response.data);
      setVolunteers(response.data.volunteers);
    } catch (error) {
      console.error("Error fetching volunteers:", error);
    }
  };

  const handleUpdateClick = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setUpdateData({
      name: volunteer.name,
      phone: volunteer.phone,
      branch: volunteer.branch,
      club: volunteer.club,
      creditScore: volunteer.creditScore,
      vid: volunteer.tzId,
      password:volunteer.original
    });
    setOpenDialog(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      await axios.put(`https://tzm-1.onrender.com/api/auth/volunteers/${selectedVolunteer.tzId}`, updateData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      toast.success("Volunteer updated successfully!");
      setOpenDialog(false);
      fetchVolunteers();
    } catch (error) {
      toast.error("Failed to update the volunteer.");
    }
  };

  const handleDelete = async (volunteerId) => {
    try {
      const authToken = localStorage.getItem("authToken");
      await axios.delete(`https://tzm-1.onrender.com/api/auth/volunteers/${volunteerId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      toast.success("Volunteer deleted successfully!");
      fetchVolunteers();
    } catch (error) {
      toast.error("Failed to delete the volunteer.");
    }
  };

  const downloadExcel = () => {
    try {
      
      // Prepare data for Excel
      const excelData = volunteers.map(volunteer => ({
        
        Name: volunteer.name,
        TZID: volunteer.tzId,
        Password: volunteer.original || 'N/A', // Include password if available
        Branch: volunteer.branch,
        Club: volunteer.club,
        Phone: volunteer.phone,
        'Credit Score': volunteer.creditScore
      }));

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Volunteers");

      // Generate Excel file
      XLSX.writeFile(workbook, "volunteers_data.xlsx");
      
      toast.success("Excel file downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download Excel file.");
      console.error("Error downloading Excel:", error);
    }
  };

  return (
    <div className="p-6 min-h-screen flex flex-col items-center bg-gray-900">
      <h2 className="text-4xl font-bold text-white mb-8 uppercase tracking-wider">View Volunteers</h2>
      
      {/* Download Excel Button */}
      <button
        onClick={downloadExcel}
        className="mb-6 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
      >
        <FaFileExcel size={20} />
        <span>Download Excel</span>
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {volunteers.map((volunteer) => (
          <div
            key={volunteer._id}
            className="bg-gray-800 bg-opacity-80 shadow-lg rounded-2xl p-6 flex flex-col items-center text-center text-white border border-gray-700 backdrop-blur-md"
          >
            <h3 className="text-2xl font-semibold capitalize tracking-wide mb-2">{volunteer.name}</h3>
            <p className="text-sm text-gray-400 font-medium mb-4">{volunteer.tzId}</p>
            <div className="text-gray-300 mt-3 space-y-3 text-sm font-medium w-full">
              <div className="flex items-center justify-center gap-2 text-lg">
                <FaIdBadge className="text-blue-400" />
                <span>{volunteer.branch}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-lg">
                <FaUsers className="text-green-400" />
                <span>{volunteer.club}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-lg">
                <FaPhoneAlt className="text-yellow-400" />
                <span>{volunteer.phone}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-lg">
                <FaStar className="text-red-400" />
                <span>{volunteer.creditScore}</span>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  className="text-blue-400 hover:text-blue-300"
                  onClick={() => handleUpdateClick(volunteer)}
                >
                  <FaEdit size={20} />
                </button>
                <button
                  className="text-red-400 hover:text-red-300"
                  onClick={() => handleDelete(volunteer.tzId)}
                >
                  <FaTrash size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Update Volunteer</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Name" name="name" value={updateData.name} onChange={handleInputChange} />
          <TextField fullWidth margin="dense" label="Phone" name="phone" value={updateData.phone} onChange={handleInputChange} />
          <TextField fullWidth margin="dense" label="Branch" name="branch" value={updateData.branch} onChange={handleInputChange} />
          <TextField fullWidth margin="dense" label="Club" name="club" value={updateData.club} onChange={handleInputChange} />
          <TextField fullWidth margin="dense" label="Credit Score" name="creditScore" value={updateData.creditScore} onChange={handleInputChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">Cancel</Button>
          <Button onClick={handleUpdate} color="primary" variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewVolunteers;
