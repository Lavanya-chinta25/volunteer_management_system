import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { FaUser, FaPhone, FaUserTag, FaUniversity, FaRegAddressCard } from "react-icons/fa";

const GenerateIDCards = () => {
  const [volunteers, setVolunteers] = useState([]);

  // Fetch volunteers from the backend
  const fetchVolunteers = async () => {
    try {
      const authToken = localStorage.getItem("authToken");

      const response = await axios.get("https://tzm-1.onrender.com/api/auth/volunteers", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setVolunteers(response.data.volunteers);
    } catch (error) {
      console.error("Error fetching volunteers:", error);
    }
  };

  // Generate ID cards
  const generateIDCards = () => {
    volunteers.forEach((volunteer) => {
      const canvas = document.createElement("canvas");
      canvas.width = 600;
      canvas.height = 350;

      const ctx = canvas.getContext("2d");

      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#222");
      gradient.addColorStop(1, "#0d47a1");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 5;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);

      // Add photo (if available)
      if (volunteer.photo) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 20, 20, 100, 100);
        };
        img.src = volunteer.photo;
      } else {
        ctx.fillStyle = "#fff";
        ctx.fillRect(20, 20, 100, 100);
        ctx.font = "bold 18px Arial";
        ctx.fillStyle = "#000";
        ctx.fillText("No Photo", 30, 70);
      }

      // Add text details
      ctx.font = "bold 18px Arial";
      ctx.fillStyle = "#fff";

      ctx.fillText(`Name: ${volunteer.name}`, 150, 50);
      ctx.fillText(`ID: ${volunteer.tzId}`, 150, 90);
      ctx.fillText(`Role: ${volunteer.role}`, 150, 130);
      ctx.fillText(`Branch: ${volunteer.branch}`, 150, 170);
      ctx.fillText(`Year: ${volunteer.year}`, 150, 210);
      ctx.fillText(`Phone: ${volunteer.phone}`, 150, 250);
      ctx.fillText(`Club: ${volunteer.club}`, 150, 290);

      // Save the canvas as an image
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${volunteer.name}_ID_Card.png`;
      link.click();
    });
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={5}
        sx={{
          padding: 4,
          textAlign: "center",
          borderRadius: 3,
          backgroundColor: "#1a1a2e",
          color: "#ffffff",
          boxShadow: "0px 0px 12px rgba(0, 255, 255, 0.5)",
          width: "100%",
          maxWidth: "700px",
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ color: "#00e676", fontWeight: "bold" }}>
          Generate ID Cards
        </Typography>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#00e676",
            color: "#000",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#00c853" },
            marginBottom: 2,
          }}
          onClick={fetchVolunteers}
        >
          Fetch Volunteers
        </Button>

        {volunteers.length > 0 && (
          <>
            <Typography variant="h6" sx={{ marginTop: 3, color: "#00e676" }}>
              Preview:
            </Typography>

            <Grid container spacing={3} sx={{ marginTop: 2 }}>
              {volunteers.map((volunteer) => (
                <Grid item xs={12} sm={6} md={4} key={volunteer._id}>
                  <Card
                    sx={{
                      backgroundColor: "#2e2e3a",
                      color: "#ffffff",
                      borderRadius: 2,
                      boxShadow: "0px 0px 10px rgba(0, 255, 255, 0.5)",
                      overflow: "hidden",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={volunteer.photo || "https://via.placeholder.com/140"}
                      alt="Volunteer"
                    />
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#00e676" }}>
                        <FaUser style={{ marginRight: 8, color: "#1976d2" }} />
                        {volunteer.name}
                      </Typography>
                      <Typography variant="body2">
                        <FaRegAddressCard style={{ marginRight: 6, color: "#388e3c" }} />
                        ID: {volunteer.tzId}
                      </Typography>
                      <Typography variant="body2">
                        <FaUserTag style={{ marginRight: 6, color: "#9c27b0" }} />
                        Role: {volunteer.role}
                      </Typography>
                      <Typography variant="body2">
                        <FaUniversity style={{ marginRight: 6, color: "#ff9800" }} />
                        Branch: {volunteer.branch} | Year: {volunteer.year}
                      </Typography>
                      <Typography variant="body2">
                        <FaPhone style={{ marginRight: 6, color: "#d32f2f" }} />
                        Phone: {volunteer.phone}
                      </Typography>
                      <Typography variant="body2">Club: {volunteer.club}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Button
              variant="contained"
              sx={{
                marginTop: 3,
                backgroundColor: "#00e676",
                color: "#000",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#00c853" },
                boxShadow: "0px 0px 10px rgba(0, 255, 255, 0.5)",
              }}
              onClick={generateIDCards}
            >
              Download ID Cards
            </Button>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default GenerateIDCards;
