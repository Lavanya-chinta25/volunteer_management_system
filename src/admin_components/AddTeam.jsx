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

const AddTeam = () => {
  const [formData, setFormData] = useState({
    teamName: "",
    teamImage: null,
    teamPosition: "",
    teamPriority: "", 
  });

  const [errors, setErrors] = useState({
    teamName: "",
    teamPosition: "",
    teamPriority: "",
  });

  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "teamImage" ? files[0] : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });

    const { teamName, teamImage, teamPosition, teamPriority } = formData;
    let newErrors = {};

    if (!teamName) newErrors.teamName = "Team name is required.";
    if (!teamImage) toast.error("Team image is required.");
    if (!teamPosition.trim()) newErrors.teamPosition = "Team position is required.";
    if (teamPriority === "" || isNaN(teamPriority) || teamPriority < 1)
      newErrors.teamPriority = "Priority must be a positive number.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formDataPayload = new FormData();
    formDataPayload.append("name", teamName);
    formDataPayload.append("image", teamImage);
    formDataPayload.append("position", teamPosition);
    formDataPayload.append("priority", teamPriority);

    try {
      const authToken = localStorage.getItem("authToken");
      await axios.post("https://tzm-1.onrender.com/api/teams", formDataPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });
      toast.success("Team added successfully!");
      setFormData({ teamName: "", teamImage: null, teamPosition: "", teamPriority: "" });
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error("Failed to add team. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 5, padding: 2 }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, backgroundColor: "rgba(61, 61, 112, 0.32)", color: "#fff", boxShadow: "none" }}>
        <Typography variant="h5" component="h2" align="center" gutterBottom>
          Add Team
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {[
              { name: "teamName", label: "Team Name" },
              { name: "teamPosition", label: "Team Position" },
              { name: "teamPriority", label: "Team Priority", type: "number" },
            ].map((field) => (
              <Grid item xs={12} key={field.name}>
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  type={field.type || "text"}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]}
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
                        {formData[field.name] && !errors[field.name] ? (
                          <CheckCircle sx={{ color: "green" }} />
                        ) : (
                          errors[field.name] && <Error sx={{ color: "red" }} />
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            ))}

            <Grid item xs={12}>
              <InputLabel htmlFor="teamImage" sx={{ color: "#fff" }}>
                Team Image
              </InputLabel>
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ marginTop: 1, backgroundColor: "#444", color: "#fff", "&:hover": { backgroundColor: "#555" } }}
                startIcon={<CloudUpload />}
              >
                Choose File
                <input type="file" id="teamImage" name="teamImage" accept="image/*" onChange={handleInputChange} ref={fileInputRef} hidden />
              </Button>
              {formData.teamImage && (
                <Typography variant="body2" sx={{ color: "white", marginTop: 1, fontSize: "0.9rem", fontStyle: "italic" }}>
                  Selected file: {formData.teamImage.name}
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
                Add Team
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AddTeam;
