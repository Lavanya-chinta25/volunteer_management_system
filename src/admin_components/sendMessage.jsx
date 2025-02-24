import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";

const SendMessage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, message } = formData;

    if (!name || !email || !phone || !message) {
      toast.error("All fields are required.");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Enter a valid email address.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone) || phone.length !== 10) {
      toast.error("Enter a valid 10-digit phone number starting with 6-9.");
      return;
    }

    setLoading(true);
    try {
      const authToken = localStorage.getItem("authToken");
      await axios.post("https://tzm-1.onrender.com/api/messages/submit", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 5, padding: 2 }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, backgroundColor: "rgba(61, 61, 112, 0.32)", color: "#fff", boxShadow: "none" }}>
        <Typography variant="h5" component="h2" align="center" gutterBottom>
          Send Message
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {[{ name: "name", label: "Your Name" }, { name: "email", label: "Your Email", type: "email" }, { name: "phone", label: "Your Phone Number", type: "text" }].map((field) => (
              <Grid item xs={12} key={field.name}>
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  type={field.type || "text"}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  sx={{
                    backgroundColor: "transparent",
                    borderRadius: 1,
                    input: { color: "white", fontSize: "1.2rem" },
                    "& label": { color: "white" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "white" },
                      "&:hover fieldset": { borderColor: "#ccc" },
                      "&.Mui-focused fieldset": { borderColor: "green" },
                    },
                  }}
                  InputLabelProps={{ style: { color: "white" } }}
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Your Message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                multiline
                rows={4}
                sx={{
                  backgroundColor: "transparent",
                  borderRadius: 1,
                  textarea: { color: "white", fontSize: "1.2rem" },
                  "& label": { color: "white" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "white" },
                    "&:hover fieldset": { borderColor: "#ccc" },
                    "&.Mui-focused fieldset": { borderColor: "green" },
                  },
                }}
                InputLabelProps={{ style: { color: "white" } }}
              />
            </Grid>
            <Grid item xs={12} className="flex justify-center">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  backgroundColor: "#5f5f60d2",
                  color: "white",
                  padding: "10px",
                  fontSize: "1.1rem",
                  "&:hover": { backgroundColor: "#292929" },
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Send Message"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default SendMessage;
