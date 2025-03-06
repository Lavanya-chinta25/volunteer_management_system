import React, { useState } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import bgImage from '../assets/bg.jpg'; // This will be the tech template image
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const Generate = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadingAll, setDownloadingAll] = useState(false);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem('authToken');
      const response = await axios.get('https://tzm-1.onrender.com/api/auth/volunteers', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setVolunteers(response.data.volunteers);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCard = async (volunteer) => {
    const cardElement = document.getElementById(`card-${volunteer._id}`);
    if (!cardElement) return;

    try {
      // Create a container with proper styling to eliminate borders
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.style.backgroundColor = '#0B0B2A'; // Match the background color
      container.style.width = cardElement.offsetWidth + 'px';
      container.style.height = cardElement.offsetHeight + 'px';
      container.style.overflow = 'hidden';
      
      // Clone the card to avoid modifying the original
      const cardClone = cardElement.cloneNode(true);
      cardClone.style.margin = '0';
      cardClone.style.padding = '0';
      cardClone.style.boxShadow = 'none';
      cardClone.style.border = 'none';
      
      // Append to container
      container.appendChild(cardClone);
      document.body.appendChild(container);

      // Capture with optimized settings
      const canvas = await html2canvas(cardClone, {
        scale: 3, // Higher scale for better quality
        logging: false,
        useCORS: true,
        backgroundColor: null, // Important for transparent background
        allowTaint: true,
        removeContainer: true,
        imageTimeout: 0, // No timeout for image loading
      });
      
      // Clean up
      document.body.removeChild(container);

      return {
        id: volunteer._id,
        name: volunteer.name,
        dataUrl: canvas.toDataURL('image/png')
      };
    } catch (error) {
      console.error(`Error generating card for ${volunteer.name}:`, error);
      return null;
    }
  };

  const downloadAllCards = async () => {
    if (volunteers.length === 0) return;
    
    try {
      setDownloadingAll(true);
      
      // Create a new JSZip instance
      const zip = new JSZip();
      
      // Process all cards
      const promises = volunteers.map(volunteer => downloadCard(volunteer));
      const results = await Promise.all(promises);
      
      // Add each card to the zip file
      results.forEach(result => {
        if (result) {
          // Convert data URL to blob
          const imageData = result.dataUrl.split(',')[1];
          // Use volunteer's name for the filename
          const sanitizedName = result.name.replace(/[^a-z0-9]/gi, '-').toLowerCase();
          zip.file(`id-card-${sanitizedName}.png`, imageData, {base64: true});
        }
      });
      
      // Generate and download the zip file
      const content = await zip.generateAsync({type: 'blob'});
      saveAs(content, 'all-id-cards.zip');
      
    } catch (error) {
      console.error('Error downloading all cards:', error);
    } finally {
      setDownloadingAll(false);
    }
  };

  // Function to download individual card
  const downloadSingleCard = async (volunteer) => {
    try {
      const result = await downloadCard(volunteer);
      if (result) {
        const link = document.createElement('a');
        link.href = result.dataUrl;
        const sanitizedName = volunteer.name.replace(/[^a-z0-9]/gi, '-').toLowerCase();
        link.download = `id-card-${sanitizedName}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error(`Error downloading card for ${volunteer.name}:`, error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B2A] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#00ffff]">ID Card Generator</h1>
          <div className="flex gap-4">
            <button
              onClick={fetchVolunteers}
              className="px-6 py-2 bg-[#00ffff] hover:bg-[#00cccc] text-[#0B0B2A] font-bold rounded-lg transition-colors"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Fetch Volunteers'}
            </button>
            
            {volunteers.length > 0 && (
              <button
                onClick={downloadAllCards}
                className="px-6 py-2 bg-[#ff00ff] hover:bg-[#cc00cc] text-white font-bold rounded-lg transition-colors"
                disabled={downloadingAll}
              >
                {downloadingAll ? 'Generating...' : 'Download All Cards'}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {volunteers.map((volunteer) => (
            <div key={volunteer._id} className="relative">
              <div
                id={`card-${volunteer._id}`}
                className="w-full aspect-[9/16] rounded-lg overflow-hidden relative"
                style={{
                  backgroundImage: `url(${bgImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: '#0B0B2A',
                  boxShadow: 'none',
                  border: 'none',
                }}
              >
                {/* Profile Image - Cyan-purple gradient border */}
                <div className="flex justify-center" style={{ marginTop: '42%' }}>
                  <div className="w-44 h-44 rounded-full relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00ffff] to-[#ff00ff] p-3">
                      <div className="w-full h-full rounded-full overflow-hidden">
                        <img
                          src={volunteer.photo || "https://via.placeholder.com/150"}
                          alt={volunteer.name}
                          className="w-full h-full object-cover"
                          crossOrigin="anonymous"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Name with two colors */}
                <div className="text-center mt-6 px-6">
                  <h2 className="text-4xl font-bold tracking-wider">
                    <span className="text-white">{volunteer.name.split(' ')[0]} </span>
                    <span className="text-[#00ffff]">
                      {volunteer.name.split(' ').slice(1).join(' ')}
                    </span>
                  </h2>
                </div>

                {/* Role */}
                <div className="text-center mt-4">
                  <h3 className="text-xl text-white font-medium tracking-wider uppercase">
                    {volunteer.role}
                  </h3>
                </div>

                {/* Branch & Year */}
                <div className="text-center mt-2">
                  <p className="text-lg text-white tracking-wider">
                    {`E${volunteer.year}`}, {volunteer.branch}
                  </p>
                </div>
              </div>
              
              {/* Individual download button */}
              <button
                onClick={() => downloadSingleCard(volunteer)}
                className="mt-2 w-full px-4 py-2 bg-[#00ffff] hover:bg-[#00cccc] text-[#0B0B2A] font-bold rounded-lg transition-colors"
              >
                Download Card
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Generate;