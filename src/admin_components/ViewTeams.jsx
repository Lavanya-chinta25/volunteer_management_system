import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";

const Viewteams = () => {
  const [teams, setteams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedteam, setSelectedteam] = useState(null); // For the update modal
  const [updateData, setUpdateData] = useState({});
  const [imagePreview, setImagePreview] = useState(""); // Preview the selected image
  const [imageFile, setImageFile] = useState(null); // Store the selected image file

  // Fetch teams from the API
  const fetchteams = () => {
    setLoading(true);
    axios
      .get("https://tzm-1.onrender.com/api/teams", { withCredentials: true })
      .then((response) => {
        setteams(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
        toast.error("Failed to fetch teams data.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchteams();
  }, []);

  const handleUpdateClick = (team) => {
    setSelectedteam(team);
    setUpdateData({ ...team }); // Pre-populate the update form
    setImagePreview(team.image || "/placeholder.jpg"); // Set initial image preview
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Preview selected image
    }
  };

  const handleUpdate = () => {
    const formData = new FormData();
    formData.append("name", updateData.name);
    formData.append("position", updateData.position);
    if (imageFile) {
      formData.append("image", imageFile); // Add image file to the form data
    }

    axios
      .put(`https://tzm-1.onrender.com/api/teams/${selectedteam._id}`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        toast.success("team updated successfully!");
        setSelectedteam(null); // Close modal
        setImageFile(null); // Reset image file
        fetchteams(); // Refetch teams from the backend
      })
      .catch((error) => {
        console.error("Error updating team:", error);
        toast.error("Failed to update the team.");
      });
  };

  const handleDelete = (teamId) => {
    axios
      .delete(`https://tzm-1.onrender.com/api/teams/${teamId}`, {
        withCredentials: true,
      })
      .then(() => {
        toast.success("team deleted successfully!");
        setteams((prev) => prev.filter((team) => team._id !== teamId));
      })
      .catch((error) => {
        console.error("Error deleting team:", error);
        toast.error("Failed to delete the team.");
      });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-6">teams</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div
            key={team._id}
            className="bg-gradient-to-r from-teal-500 to-blue-600 shadow-xl rounded-lg overflow-hidden"
          >
            <div className="w-full h-40 overflow-hidden bg-gray-700">
              <img
                src={team.image || "/placeholder.jpg"}
                alt={team.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 text-white">
              <h3 className="text-lg font-semibold">{team.name.toUpperCase()}</h3>
              <p className="text-sm">Position: {team.position}</p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleUpdateClick(team)}
                  className="bg-[#17569ec5] hover:bg-[#17569ef7] text-white px-3 py-2 rounded"
                >
                  <FaEdit className="inline mr-2" />
                  Update
                </button>
                <button
                  onClick={() => handleDelete(team._id)}
                  className="bg-[#a81717f0] hover:bg-red-600 text-white px-3 py-2 rounded"
                >
                  <FaTrash className="inline mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Update Modal */}
      {selectedteam && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="bg-black rounded-lg p-6 w-full max-w-md overflow-auto h-auto max-h-[80vh]"
            style={{
              overflowY: "scroll",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <h3 className="text-lg font-bold mb-4">Update team</h3>
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
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-40 object-contain border rounded"
              />
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setSelectedteam(null)}
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
