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

const AddCoreTeam = () => {
  const [formData, setFormData] = useState({
    memberName: "",
    memberImage: null,
    memberPosition: "",
  });

  const [errors, setErrors] = useState({
    memberName: "",
    memberPosition: "",
  });

  const fileInputRef = useRef(null);
  
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "memberImage" ? files[0] : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });

    const { memberName, memberImage, memberPosition } = formData;
    let newErrors = {};

    if (!memberName) newErrors.memberName = "Member name is required.";
    if (!memberImage) toast.error("Member image is required.");
    if (!memberPosition) newErrors.memberPosition = "Position is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formDataPayload = new FormData();
    formDataPayload.append("name", memberName);
    formDataPayload.append("image", memberImage);
    formDataPayload.append("position", memberPosition);

    try {
      const authToken = localStorage.getItem("authToken");
      await axios.post("https://tzm-1.onrender.com/api/coreteam", formDataPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });
      toast.success("Core team member added successfully!");
      setFormData({ memberName: "", memberImage: null, memberPosition: "" });
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error("Failed to add core team member. Please try again.");
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
          Add Core Team Member
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Member Name"
                name="memberName"
                value={formData.memberName}
                onChange={handleInputChange}
                error={!!errors.memberName}
                helperText={errors.memberName}
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
                      {formData.memberName ? (
                        <CheckCircle sx={{ color: "green" }} />
                      ) : (
                        errors.memberName && <Error sx={{ color: "red" }} />
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Member Position"
                name="memberPosition"
                value={formData.memberPosition}
                onChange={handleInputChange}
                error={!!errors.memberPosition}
                helperText={errors.memberPosition}
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
              <InputLabel htmlFor="memberImage" sx={{ color: "#fff" }}>
                Member Image
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
                  id="memberImage"
                  name="memberImage"
                  accept="image/*"
                  onChange={handleInputChange}
                  ref={fileInputRef}
                  hidden
                />
              </Button>
              {formData.memberImage && (
                <Typography
                  variant="body2"
                  sx={{ color: "white", marginTop: 1, fontSize: "0.9rem", fontStyle: "italic" }}
                >
                  Selected file: {formData.memberImage.name}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" fullWidth sx={{
                marginTop: 2,
                padding: 1,
                fontSize: "1rem",
                backgroundColor: "#4CAF50",
                "&:hover": { backgroundColor: "#388E3C" },
              }}>
                Add Member
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AddCoreTeam;
