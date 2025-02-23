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

const AddStalls = () => {
  const [formData, setFormData] = useState({
    stallName: "",
    stallImage: null,
    stallPosition: "",
  });

  const [errors, setErrors] = useState({
    stallName: "",
    stallPosition: "",
  });

  const fileInputRef = useRef(null);
  const positionPattern = /^(ab[1-3])\s*(g[1-9]|g10|f[1-9]|f10|s[1-9]|s10|t[1-9]|t10)$/i;

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "stallImage" ? files[0] : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });

    const { stallName, stallImage, stallPosition } = formData;
    let newErrors = {};

    if (!stallName) newErrors.stallName = "Stall name is required.";
    if (!stallImage) toast.error("Stall image is required.");
    if (!stallPosition.trim() || !positionPattern.test(stallPosition.trim())) {
      newErrors.stallPosition = "Invalid position format.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formDataPayload = new FormData();
    formDataPayload.append("name", stallName);
    formDataPayload.append("image", stallImage);
    formDataPayload.append("position", stallPosition);

    try {
      const authToken = localStorage.getItem("authToken");
      await axios.post("https://tzm-1.onrender.com/api/stalls", formDataPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });
      toast.success("Stall added successfully!");
      setFormData({ stallName: "", stallImage: null, stallPosition: "" });
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error("Failed to add stall. Please try again.");
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
          Add Stall
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Stall Name"
                name="stallName"
                value={formData.stallName}
                onChange={handleInputChange}
                error={!!errors.stallName}
                helperText={errors.stallName}
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
                      {formData.stallName ? (
                        <CheckCircle sx={{ color: "green" }} />
                      ) : (
                        errors.stallName && <Error sx={{ color: "red" }} />
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Stall Position"
                name="stallPosition"
                value={formData.stallPosition}
                onChange={handleInputChange}
                error={!!errors.stallPosition}
                helperText={errors.stallPosition}
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
                      {formData.stallPosition.trim() &&
                      positionPattern.test(formData.stallPosition.trim()) ? (
                        <CheckCircle sx={{ color: "green" }} />
                      ) : (
                        formData.stallPosition && <Error sx={{ color: "red" }} />
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
  <InputLabel htmlFor="stallImage" sx={{ color: "#fff" }}>
    Stall Image
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
      id="stallImage"
      name="stallImage"
      accept="image/*"
      onChange={handleInputChange}
      ref={fileInputRef}
      hidden
    />
  </Button>

  
  {formData.stallImage && (
    <Typography
      variant="body2"
      sx={{
        color: "white",
        marginTop: 1,
        fontSize: "0.9rem",
        fontStyle: "italic",
      }}
    >
      Selected file: {formData.stallImage.name}
    </Typography>
  )}
</Grid>


            <Grid item xs={12}>
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
                Add Stall
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AddStalls;
