import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Button, Typography } from "@mui/material";
const Viewteams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [updateData, setUpdateData] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(
        "https://tzm-1.onrender.com/api/teams",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setTeams(response.data);
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast.error("Failed to fetch teams data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleUpdateClick = (team) => {
    setSelectedTeam(team);
    setUpdateData({ ...team });
    setImagePreview(team.image || "/placeholder.jpg");
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
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const authToken = localStorage.getItem("authToken");
      await axios.put(
        `https://tzm-1.onrender.com/api/teams/${selectedTeam._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Team updated successfully!");
      setSelectedTeam(null);
      setImageFile(null);
      fetchTeams();
    } catch (error) {
      console.error("Error updating team:", error);
      toast.error("Failed to update the team.");
    }
  };

  const handleDelete = async (teamId) => {
    try {
      const authToken = localStorage.getItem("authToken");
      await axios.delete(`https://tzm-1.onrender.com/api/teams/${teamId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      toast.success("Team deleted successfully!");
      setTeams((prev) => prev.filter((team) => team._id !== teamId));
    } catch (error) {
      console.error("Error deleting team:", error);
      toast.error("Failed to delete the team.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-6">Teams</h2>
      <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "15px",
        padding: "10px",
        justifyContent: "center",
      }}
    >
      {teams.map((team) => (
        <div
          key={team._id}
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "280px",
            paddingTop: "100%",
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
              height: "75%",
              zIndex: 1,
            }}
          >
            <img
              src={team.image || "/placeholder.jpg"}
              alt={team.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "8px 8px 0 0",
              }}
            />
          </div>

          {/* Overlay Contact Card */}
          <div
            style={{
              position: "absolute",
              top: "60%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "85%",
              minHeight: "80px",
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
              {team.name}
            </Typography>
            <Typography style={{ color: "#ddd", fontSize: "12px" }}>
              {team.position}
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
                onClick={() => handleUpdateClick(team)}
              >
                <FaEdit /> Update
              </Button>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                style={{ fontSize: "12px", padding: "5px 8px" }}
                onClick={() => handleDelete(team._id)}
              >
                <FaTrash /> Delete
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>

      {selectedTeam && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Update Team</h3>
            <label className="block mb-2">
              Name:
              <input
                type="text"
                name="name"
                value={updateData.name || ""}
                onChange={handleInputChange}
                className="w-full border rounded p-2 text-black"
              />
            </label>
            <label className="block mb-2">
              Position:
              <input
                type="text"
                name="position"
                value={updateData.position || ""}
                onChange={handleInputChange}
                className="w-full border rounded p-2 text-black"
              />
            </label>
            <label className="block mb-2">
              Image:
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border rounded p-2"
              />
            </label>
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-40 object-contain border rounded"
                />
              </div>
            )}
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setSelectedTeam(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Viewteams;

