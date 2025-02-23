import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Card, CardContent, Typography, Button, Modal, Box, TextField } from "@mui/material";

const ViewCoreTeam = () => {
  const [coreTeam, setCoreTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [updateData, setUpdateData] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchCoreTeam();
  }, []);

  const fetchCoreTeam = async () => {
    setLoading(true);
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get("https://tzm-1.onrender.com/api/coreteam", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setCoreTeam(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch core team data.");
      setLoading(false);
    }
  };

  const handleUpdateClick = (member) => {
    setSelectedMember(member);
    setUpdateData({ ...member });
    setImagePreview(member.image || "/placeholder.jpg");
    setOpenModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("name", updateData.name);
    formData.append("position", updateData.position);
    if (imageFile) formData.append("image", imageFile);

    try {
      const authToken = localStorage.getItem("authToken");
      await axios.put(
        `https://tzm-1.onrender.com/api/coreteam/${selectedMember._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Updated successfully!");
      setSelectedMember(null);
      setImageFile(null);
      fetchCoreTeam();
      setOpenModal(false);
    } catch (error) {
      toast.error("Update failed.");
    }
  };

  const handleDelete = async (memberId) => {
    try {
      const authToken = localStorage.getItem("authToken");
      await axios.delete(`https://tzm-1.onrender.com/api/coreteam/${memberId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      toast.success("Deleted successfully!");
      setCoreTeam((prev) => prev.filter((member) => member._id !== memberId));
    } catch (error) {
      toast.error("Delete failed.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Core Team Members
      </Typography>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", // Smaller min size
              gap: "15px", // Reduced gap
              padding: "10px",
              justifyContent: "center",
            }}
          >
            {coreTeam.map((member) => (
              <div
                key={member._id}
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "280px", // Limits max width for smaller cards
                  paddingTop: "100%", // Adjusted to shrink height
                  margin: "auto",
                }}
              >
                {/* Image Container */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "75%", // Reduced height of image
                    zIndex: 1,
                  }}
                >
                  <img
                    src={member.image || "/placeholder.jpg"}
                    alt={member.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "8px 8px 0 0",
                    }}
                  />
                </div>

                {/* Overlay Contact Card (Smaller) */}
                <div
                  style={{
                    position: "absolute",
                    top: "60%", // Reduced overlap
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "85%", // Slightly smaller width
                    minHeight: "80px", // Reduced height
                    padding: "12px",
                    textAlign: "center",
                    borderRadius: "10px",
                    boxShadow: "0 3px 8px rgba(0, 0, 0, 0.15)",
                    backdropFilter: "blur(8px)",
                    background: "rgba(11, 10, 10, 0.482)",
                    zIndex: 2,
                  }}
                >
                  <Typography style={{ fontWeight: "bold", fontSize: "14px", color: "#fff" }}>
                    {member.name}
                  </Typography>
                  <Typography style={{ color: "#ddd", fontSize: "12px" }}>
                    {member.position}
                  </Typography>

                  <div
                    style={{
                      marginTop: "8px",
                      display: "flex",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      style={{ fontSize: "12px", padding: "5px 8px" }}
                      onClick={() => handleUpdateClick(member)}
                    >
                      <FaEdit /> Update
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      style={{ fontSize: "12px", padding: "5px 8px" }}
                      onClick={() => handleDelete(member._id)}
                    >
                      <FaTrash /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>



      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, backgroundColor: "white", boxShadow: 24, padding: "20px", borderRadius: "8px" }}>
          <Typography variant="h6" gutterBottom>
            Update Member
          </Typography>
          <TextField label="Name" name="name" value={updateData.name} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField label="Position" name="position" value={updateData.position} onChange={handleInputChange} fullWidth margin="normal" />
          <input accept="image/*" type="file" onChange={handleImageChange} style={{ marginTop: "10px" }} />
          {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: "100px", marginTop: "10px" }} />}
          <div style={{ marginTop: "10px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button onClick={handleUpdate} variant="contained" color="primary">Update</Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ViewCoreTeam;
