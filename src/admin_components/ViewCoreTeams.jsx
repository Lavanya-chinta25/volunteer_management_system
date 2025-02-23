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
      await axios.put(`https://tzm-1.onrender.com/api/coreteam/${selectedMember._id}`, formData, {
        headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "multipart/form-data" },
      });
      toast.success("Updated successfully!");
      setSelectedMember(null);
      setImageFile(null);
      fetchCoreTeam();
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
    <div className="container mx-auto px-4 py-6">
      <Typography variant="h4" align="center" gutterBottom>
        Core Team Members
      </Typography>
      <Swiper modules={[Navigation]} navigation spaceBetween={20} slidesPerView={3}>
        {coreTeam.map((member) => (
          <SwiperSlide key={member._id}>
            <Card sx={{ width: 280, m: "auto", textAlign: "center", boxShadow: 3, borderRadius: 3, overflow: "hidden" }}>
              <img 
                src={member.image || "/placeholder.jpg"} 
                alt={member.name} 
                style={{ 
                  width: "100%", 
                  height: "250px", 
                  objectFit: "cover", 
                  objectPosition: "top center", 
                  borderRadius: "12px 12px 0 0" 
                }}
              />
              <CardContent sx={{ padding: 2 }}>
                <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: "bold" }}>{member.name}</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.85rem" }}>
                  {member.position}
                </Typography>
                <Box mt={2} display="flex" justifyContent="center" gap={1}>
                  <Button variant="contained" color="primary" size="small" onClick={() => handleUpdateClick(member)}>
                    <FaEdit /> Update
                  </Button>
                  <Button variant="contained" color="secondary" size="small" onClick={() => handleDelete(member._id)}>
                    <FaTrash /> Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Update Modal */}
      <Modal open={!!selectedMember} onClose={() => setSelectedMember(null)}>
        <Box sx={{ bgcolor: "white", p: 4, borderRadius: 2, maxWidth: 400, mx: "auto", mt: 10 }}>
          <Typography variant="h6">Update Core Team Member</Typography>
          <TextField label="Name" fullWidth margin="normal" name="name" value={updateData.name || ""} onChange={handleInputChange} />
          <TextField label="Position" fullWidth margin="normal" name="position" value={updateData.position || ""} onChange={handleInputChange} />
          <input type="file" accept="image/*" onChange={handleImageChange} style={{ margin: "10px 0" }} />
          {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: "100%", height: 120, objectFit: "cover" }} />}
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="outlined" onClick={() => setSelectedMember(null)}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleUpdate}>Save</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ViewCoreTeam;
