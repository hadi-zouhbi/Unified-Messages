/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import axios from "axios";
// IG & FB dummy data
import { DUMMY_MESSAGES } from "../data/dummyMessages";

const Dashboard = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const gmailConnectedFromRedirect =
    queryParams.get("gmailConnected") === "true";

  const [gmailConnected, setGmailConnected] = useState(
    gmailConnectedFromRedirect
  );
  const [gmailMessages, setGmailMessages] = useState([]);
  const [selectedSource, setSelectedSource] = useState("All");

  useEffect(() => {
    const fetchGmail = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/fetchGmailMessages`,
          {
            withCredentials: true,
          }
        );

        if (res.data && Array.isArray(res.data.messages)) {
          const formatted = res.data.messages.map((msg, index) => ({
            id: index + 1,
            from: "Gmail",
            title: msg.title || "No Subject",
            content: msg.content || "No content available",
            unread: true,
          }));

          setGmailMessages(formatted);
        }
      } catch (error) {
        console.log(`Could not fetch messages --- ${error}`);
      }
    };

    if (gmailConnected) {
      fetchGmail();
    }
  }, [gmailConnected]);

  const handleGmailLogin = () => {
    window.location.href = `${
      import.meta.env.VITE_API_BASE_URL
    }/api/auth/google`;
  };

  const getMessages = () => {
    const instagram = DUMMY_MESSAGES.Instagram.map((msg) => ({
      ...msg,
      source: "Instagram",
    }));

    const facebook = DUMMY_MESSAGES.Facebook.map((msg) => ({
      ...msg,
      source: "Facebook",
    }));

    const gmail = gmailMessages.map((msg) => ({
      ...msg,
      source: "Gmail",
    }));

    if (selectedSource === "All") {
      return [...gmail, ...instagram, ...facebook];
    } else if (selectedSource === "Gmail") {
      return gmail;
    } else if (selectedSource === "Instagram") {
      return instagram;
    } else if (selectedSource === "Facebook") {
      return facebook;
    }

    return [];
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar selectedTab={selectedSource} onSelectTab={setSelectedSource} />

      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4 capitalize">
          {selectedSource} Messages
        </h1>

        {/* Show Gmail login button if no Gmail connected */}
        {selectedSource === "Gmail" && gmailMessages.length === 0 && (
          <button
            onClick={handleGmailLogin}
            className="mb-4 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Connect Gmail
          </button>
        )}

        <div className="space-y-4">
          {getMessages().length === 0 ? (
            <p>No messages to show.</p>
          ) : (
            getMessages().map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-4 bg-white p-4 rounded shadow border-l-4 ${
                  msg.unread ? "border-blue-500" : "border-gray-200"
                }`}
              >
                <div className="pt-1">
                  {msg.unread ? (
                    <span className="inline-block h-3 w-3 bg-green-500 rounded-full"></span>
                  ) : (
                    <CheckCircleIcon className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">From: {msg.from}</p>
                  <p className="text-gray-800">{msg.title}</p>
                  <p className="text-gray-500 text-sm">{msg.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
