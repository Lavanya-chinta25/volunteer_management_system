import React, { useState } from "react";
import { toast } from "react-toastify";
import { Container, Paper, Typography, Button, InputLabel } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

const UploadPhoto = () => {
  const [photo, setPhoto] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photo) {
      toast.error("Please upload a photo.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", photo);

    try {
      const authToken = localStorage.getItem("authToken");

      const response = await fetch("https://tzm-1.onrender.com/api/auth/upload-photo", {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Photo uploaded successfully!");
      } else {
        toast.error(data.message || "Failed to upload photo.");
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error("An error occurred. Please try again.");
    }

    // Reset
    setPhoto(null);
    e.target.reset();
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 5, padding: 2 }}>
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          borderRadius: 2,
          backgroundColor: "rgba(61, 61, 112, 0.32)",
          color: "#fff",
          boxShadow: "none",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Upload Photo
        </Typography>
        <form onSubmit={handleSubmit}>
          <InputLabel sx={{ color: "#fff", marginBottom: 1 }}>Select Image</InputLabel>
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{
              backgroundColor: "#444",
              color: "#fff",
              "&:hover": { backgroundColor: "#555" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            startIcon={<CloudUpload />}
          >
            Choose File
            <input type="file" accept="image/*" hidden onChange={handlePhotoChange} />
          </Button>

          {photo && (
            <Typography variant="body2" sx={{ color: "white", marginTop: 1, fontStyle: "italic" }}>
              Selected file: {photo.name}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              marginTop: 2,
              padding: 1,
              fontSize: "1rem",
              backgroundColor: "#4CAF50",
              "&:hover": { backgroundColor: "#388E3C" },
            }}
          >
            Upload Photo
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default UploadPhoto;
