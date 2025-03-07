import React, { useState, useEffect } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import bgImage from '../assets/idBg.jpg';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const Generate = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    setUserRole(storedRole);
  }, []);

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
      const canvas = await html2canvas(cardElement, {
        scale: window.devicePixelRatio || 3, // Maintain high quality
        logging: false,
        useCORS: true,
        backgroundColor: null, // Ensure transparency
        removeContainer: true, // Prevent extra wrapping that might cause borders
      });
  
      return {
        id: volunteer._id,
        name: volunteer.name,
        dataUrl: canvas.toDataURL("image/png"),
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
      const zip = new JSZip();
      const results = await Promise.all(volunteers.map(volunteer => downloadCard(volunteer)));

      results.forEach(result => {
        if (result) {
          const sanitizedName = result.name.replace(/[^a-z0-9]/gi, '-').toLowerCase();
          zip.file(`id-card-${sanitizedName}.png`, result.dataUrl.split(',')[1], { base64: true });
        }
      });

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'all-id-cards.zip');
    } catch (error) {
      console.error('Error downloading all cards:', error);
    } finally {
      setDownloadingAll(false);
    }
  };

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
          {userRole !== 'Volunteer' && (
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
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {volunteers.map((volunteer) => (
          <div key={volunteer._id} className="relative">
            <div
              id={`card-${volunteer._id}`}
              className="w-full rounded-lg overflow-hidden relative"
              style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundColor: '#0B0B2A',
                aspectRatio: '3 / 4',
                boxShadow: 'none',
                border: 'none',
              }}
            >
              <div className="flex justify-center" style={{ marginTop: '25%' }}>
                <div className="w-40 h-40 rounded-full relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00ffff] to-[#ff00ff] p-[5px]">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                      <img
                        src={volunteer.photo || "https://via.placeholder.com/150"}
                        alt={volunteer.name}
                        className="w-full h-full object-contain bg-white"
                        crossOrigin="anonymous"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-6 px-6">
                <h2 className="text-4xl font-bold tracking-wider">
                  {(() => {
                    const fullName = volunteer.name
                      .split(" ")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ");

                    // Find the first space after the 7th character
                    let splitIndex = fullName.indexOf(" ", 7);
                    if (splitIndex === -1) splitIndex = fullName.length; // If no space found, keep full name white

                    return (
                      <>
                        <span className="text-white">{fullName.slice(0, splitIndex)}</span>
                        <span className="text-[#24e4e4]">{fullName.slice(splitIndex)}</span>
                      </>
                    );
                  })()}
                </h2>
              </div>

              <div className="text-center mt-3">
                <h3 className="text-xl text-white font-medium tracking-wider uppercase">
                  {volunteer.club}
                </h3>
              </div>

              <div className="text-center mt-1">
                <p className="text-lg text-white tracking-wider">
                  {`E${volunteer.year}, ${volunteer.branch}`}
                </p>
              </div>
            </div>

            {userRole !== 'Volunteer' && (
              <button
                onClick={() => downloadSingleCard(volunteer)}
                className="mt-2 w-full px-4 py-2 bg-[#24e4e4] hover:bg-[#00cccc] text-[#0B0B2A] font-bold rounded-lg transition-colors"
              >
                Download Card
              </button>
            )}
          </div>
        ))}

        </div>
      </div>
    </div>
  );
};

export default Generate;
