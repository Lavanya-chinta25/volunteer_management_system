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
  const fetchsponsors = () => {
    setLoading(true);
    axios
      .get("https://tzm-1.onrender.com/api/sponsors", { withCredentials: true })
      .then((response) => {
        console.log("sponsr get");
        console.log("view sponser",response);
        setsponsors(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching sponsors:", error);
        toast.error("Failed to fetch sponsors data.");
        setLoading(false);
      });
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

  const handleUpdate = () => {
    const formData = new FormData();
    formData.append("name", updateData.name);
    formData.append("type", updateData.type);
    if (imageFile) {
      formData.append("image", imageFile); // Add image file to the form data
    }

    axios
      .put(`https://tzm-1.onrender.com/api/sponsors/${selectedsponsor._id}`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        toast.success("sponsor updated successfully!");
        setSelectedsponsor(null); // Close modal
        setImageFile(null); // Reset image file
        fetchsponsors(); // Refetch sponsors from the backend
      })
      .catch((error) => {
        console.error("Error updating sponsor:", error);
        toast.error("Failed to update the sponsor.");
      });
  };

  const handleDelete = (sponsorId) => {
    axios
      .delete(`https://tzm-1.onrender.com/api/sponsors/${sponsorId}`, {
        withCredentials: true,
      })
      .then(() => {
        toast.success("sponsor deleted successfully!");
        setsponsors((prev) => prev.filter((sponsor) => sponsor._id !== sponsorId));
      })
      .catch((error) => {
        console.error("Error deleting sponsor:", error);
        toast.error("Failed to delete the sponsor.");
      });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-6">sponsors</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sponsors.map((sponsor) => (
          <div
            key={sponsor._id}
            className="bg-gradient-to-r from-teal-500 to-blue-600 shadow-xl rounded-lg overflow-hidden"
          >
            <div className="w-full h-40 overflow-hidden bg-gray-700">
              <img
                src={sponsor.image || "/placeholder.jpg"}
                alt={sponsor.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 text-white">
              <h3 className="text-lg font-semibold">{sponsor.name.toUpperCase()}</h3>
              <p className="text-sm">type: {sponsor.type}</p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleUpdateClick(sponsor)}
                  className="bg-[#17569ec5] hover:bg-[#17569ef7] text-white px-3 py-2 rounded"
                >
                  <FaEdit className="inline mr-2" />
                  Update
                </button>
                <button
                  onClick={() => handleDelete(sponsor._id)}
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
            <h3 className="text-lg font-bold mb-4">Update sponsor</h3>
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
              type:
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
