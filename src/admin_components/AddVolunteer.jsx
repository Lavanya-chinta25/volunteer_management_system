import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { CheckCircle, Error } from "@mui/icons-material";

const AddVolunteer = () => {
  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    year: "",
    club: "",
    role: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  
  const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: name === "phone" ? (!value ? "This field is required." : !validatePhone(value) ? "Enter a valid mobile number." : "") : !value ? "This field is required." : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, branch, year, club, role, phone } = formData;

    if (!name || !branch || !year || !club || !role || !phone) {
      toast.error("All fields are required.");
      return;
    }

    if (!validatePhone(phone)) {
      toast.error("Enter a valid mobile number.");
      return;
    }

    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch("https://tzm-1.onrender.com/api/auth/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ name, branch, year, club, role, phone }),
      });

      if (response.ok) {
        toast.success("Volunteer added successfully!");
        setFormData({ name: "", branch: "", year: "", club: "", role: "", phone: "" });
        setErrors({});
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to add volunteer.");
      }
    } catch (error) {
      console.error("Error adding volunteer:", error);
      toast.error("An error occurred while adding the volunteer.");
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
          color: "white",
          boxShadow: "none",
        }}
      >
        <Typography variant="h5" component="h2" align="center" gutterBottom>
          Add Volunteer
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {["name", "phone"].map((field) => (
              <Grid item xs={12} key={field}>
                <TextField
                  fullWidth
                  label={field === "name" ? "Volunteer Name" : "Volunteer Phone"}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  error={!!errors[field]}
                  helperText={errors[field]}
                  sx={{
                    backgroundColor: "transparent",
                    borderRadius: 1,
                    input: { color: "white" },
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
                        {!errors[field] && formData[field] ? (
                          <CheckCircle sx={{ color: "green" }} />
                        ) : (
                          errors[field] && <Error sx={{ color: "red" }} />
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            ))}

            {["branch", "year", "club", "role"].map((field) => (
              <Grid item xs={12} key={field}>
                <TextField
                  select
                  fullWidth
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  error={!!errors[field]}
                  helperText={errors[field]}
                  sx={{
                    backgroundColor: "transparent",
                    borderRadius: 1,
                    "& label": { color: "white" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "white" },
                      "&:hover fieldset": { borderColor: "#ccc" },
                      "&.Mui-focused fieldset": { borderColor: "green" },
                    },
                  }}
                  InputLabelProps={{ style: { color: "white" } }}
                  SelectProps={{
                    sx: { color: "white" },
                  }}
                >
                  {field === "branch" && ["PUC", "CSE", "ECE", "EEE", "Civil", "Mechanical", "Chemical", "Metallurgy"].map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                  {field === "year" && ["P1", "P2", "E1", "E2", "E3", "E4"].map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                  {field === "club" && ["Web Club", "Hospitality Club", "Marketing Club", "Infra Club", "PUC Club", "Workshop Club","Promotions Club","Disciplinary Club","Project Expo Club"].map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                  {field === "role" && ["Admin", "Volunteer", "Core Team"].map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            ))}

            <Grid item xs={12}>
              <Button type="submit" variant="contained" fullWidth sx={{ marginTop: 2, padding: 1, fontSize: "1rem", backgroundColor: "#4CAF50", "&:hover": { backgroundColor: "#388E3C" } }}>
                Add Volunteer
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AddVolunteer;
