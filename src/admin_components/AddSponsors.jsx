import React, { useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  InputLabel,
  InputAdornment,
} from "@mui/material";
import { CheckCircle, Error, CloudUpload } from "@mui/icons-material";

const Addsponsor = () => {
  const [formData, setFormData] = useState({
    sponsorName: "",
    sponsorImage: null,
    sponsorType: "",
  });

  const [errors, setErrors] = useState({
    sponsorName: "",
    sponsorType: "",
  });

  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "sponsorImage" ? files[0] : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });

    const { sponsorName, sponsorImage, sponsorType } = formData;
    let newErrors = {};

    if (!sponsorName) newErrors.sponsorName = "Sponsor name is required.";
    if (!sponsorImage) toast.error("Sponsor image is required.");
    if (!sponsorType) newErrors.sponsorType = "Sponsor type is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formDataPayload = new FormData();
    formDataPayload.append("name", sponsorName);
    formDataPayload.append("image", sponsorImage);
    formDataPayload.append("type", sponsorType);

    try {
      const authToken = localStorage.getItem("authToken");
      await axios.post("https://tzm-1.onrender.com/api/sponsors", formDataPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });
      toast.success("Sponsor added successfully!");
      setFormData({ sponsorName: "", sponsorImage: null, sponsorType: "" });
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error("Failed to add sponsor. Please try again.");
    }
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
        }}
      >
        <Typography variant="h5" component="h2" align="center" gutterBottom>
          Add Sponsor
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Sponsor Name"
                name="sponsorName"
                value={formData.sponsorName}
                onChange={handleInputChange}
                error={!!errors.sponsorName}
                helperText={errors.sponsorName}
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
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {formData.sponsorName ? (
                        <CheckCircle sx={{ color: "green" }} />
                      ) : (
                        errors.sponsorName && <Error sx={{ color: "red" }} />
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Sponsor Type"
                name="sponsorType"
                value={formData.sponsorType}
                onChange={handleInputChange}
                error={!!errors.sponsorType}
                helperText={errors.sponsorType}
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

            <Grid item xs={12}>
              <InputLabel htmlFor="sponsorImage" sx={{ color: "#fff" }}>
                Sponsor Image
              </InputLabel>
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{
                  marginTop: 1,
                  backgroundColor: "#444",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#555" },
                }}
                startIcon={<CloudUpload />}
              >
                Choose File
                <input
                  type="file"
                  id="sponsorImage"
                  name="sponsorImage"
                  accept="image/*"
                  onChange={handleInputChange}
                  ref={fileInputRef}
                  hidden
                />
              </Button>
              {formData.sponsorImage && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "white",
                    marginTop: 1,
                    fontSize: "0.9rem",
                    fontStyle: "italic",
                  }}
                >
                  Selected file: {formData.sponsorImage.name}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ marginTop: 2, padding: 1, fontSize: "1rem", backgroundColor: "#4CAF50", "&:hover": { backgroundColor: "#388E3C" } }}
              >
                Add Sponsor
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Addsponsor;
