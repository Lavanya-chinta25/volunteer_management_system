import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShowMessages = () => {
  const [messages, setMessages] = useState([]); // State to store the messages
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch messages from the API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("https://tzm-1.onrender.com/api/messages/");
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }
        const data = await response.json();
        setMessages(data); // Set the fetched messages to the state
      } catch (error) {
        toast.error("Error fetching messages.");
        console.error(error);
      } finally {
        setLoading(false); // Stop loading when data is fetched
      }
    };

    fetchMessages();
  }, []); // Empty dependency array ensures the fetch only runs once when the component mounts

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4 text-center">Messages</h2>

      {loading ? (
        <div className="flex justify-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={message._id}
                className="bg-white bg-opacity-30 backdrop-blur-sm p-4 rounded-md shadow-lg hover:shadow-xl transition-all ease-in-out duration-300"
              >
                <h3 className="text-sm font-semibold">sent by {message.name}</h3>
                <p className="text-xl mt-2">{message.message}</p>
              </div>
            ))
          ) : (
            <p className="text-center">No messages available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ShowMessages;
