import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";

const Viewsponsors = () => {
  const [sponsors, setsponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedsponsor, setSelectedsponsor] = useState(null); // For the update modal
  const [updateData, setUpdateData] = useState({});
  const [imagePreview, setImagePreview] = useState(""); // Preview the selected image
  const [imageFile, setImageFile] = useState(null); // Store the selected image file

  // Fetch sponsors from the API
  const fetchsponsors = async () => {
    setLoading(true);
    try {
      const authToken = localStorage.getItem("authToken");

      const response = await axios.get(
        "https://tzm-1.onrender.com/api/sponsors",
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Include the token in the Authorization header
          },
        }
      );
      setsponsors(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sponsors:", error);
      toast.error("Failed to fetch sponsors data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchsponsors();
  }, []);

  const handleUpdateClick = (sponsor) => {
    setSelectedsponsor(sponsor);
    setUpdateData({ ...sponsor }); // Pre-populate the update form
    setImagePreview(sponsor.image || "/placeholder.jpg"); // Set initial image preview
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

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("name", updateData.name);
    formData.append("type", updateData.type);
    if (imageFile) {
      formData.append("image", imageFile); // Add image file to the form data
    }

    try {
      const authToken = localStorage.getItem("authToken");

      await axios.put(
        `https://tzm-1.onrender.com/api/sponsors/${selectedsponsor._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Include the token in the Authorization header
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Sponsor updated successfully!");
      setSelectedsponsor(null); // Close modal
      setImageFile(null); // Reset image file
      fetchsponsors(); // Refetch sponsors from the backend
    } catch (error) {
      console.error("Error updating sponsor:", error);
      toast.error("Failed to update the sponsor.");
    }
  };

  const handleDelete = async (sponsorId) => {
    try {
      const authToken = localStorage.getItem("authToken");

      await axios.delete(`https://tzm-1.onrender.com/api/sponsors/${sponsorId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Include the token in the Authorization header
        },
      });
      toast.success("Sponsor deleted successfully!");
      setsponsors((prev) => prev.filter((sponsor) => sponsor._id !== sponsorId));
    } catch (error) {
      console.error("Error deleting sponsor:", error);
      toast.error("Failed to delete the sponsor.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-6">Sponsors</h2>
      <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "15px",
        padding: "10px",
        justifyContent: "center",
      }}
    >
      {sponsors.map((sponsor) => (
        <div
          key={sponsor._id}
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
              backgroundColor: "black", // Ensures the empty space is filled with white
              borderRadius: "8px 8px 0 0",
            }}
          >
            <img
              src={sponsor.image || "/placeholder.jpg"}
              alt={sponsor.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "8px 8px 0 0",
              }}
            />
          </div>

          {/* Overlay Contact Card (Smaller) */}
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
            <h3 style={{ fontWeight: "bold", fontSize: "14px", color: "#fff" }}>
              {sponsor.name.toUpperCase()}
            </h3>
            <p style={{ color: "#ddd", fontSize: "12px" }}>Type: {sponsor.type}</p>

            <div
              style={{
                marginTop: "8px",
                display: "flex",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <button
                onClick={() => handleUpdateClick(sponsor)}
                style={{
                  backgroundColor: "#17569ec5",
                  color: "white",
                  padding: "5px 8px",
                  fontSize: "12px",
                  borderRadius: "5px",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <FaEdit /> Update
              </button>
              <button
                onClick={() => handleDelete(sponsor._id)}
                style={{
                  backgroundColor: "#a81717f0",
                  color: "white",
                  padding: "5px 8px",
                  fontSize: "12px",
                  borderRadius: "5px",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>

      {/* Update Modal */}
      {selectedsponsor && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="bg-black rounded-lg p-6 w-full max-w-md overflow-auto h-auto max-h-[80vh]"
            style={{
              overflowY: "scroll",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <h3 className="text-lg font-bold mb-4">Update Sponsor</h3>
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
              Type:
              <input
                type="text"
                name="type"
                value={updateData.type || ""}
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
                onClick={() => setSelectedsponsor(null)}
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

export default Viewsponsors;
