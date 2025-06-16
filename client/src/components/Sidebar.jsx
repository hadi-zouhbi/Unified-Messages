import React from "react";
import { useNavigate } from "react-router-dom";
import MainBtn from "./MainBtn";
import {
  EnvelopeIcon,
  ChatBubbleBottomCenterTextIcon,
  InboxArrowDownIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { InstagramIcon, FacebookIcon } from "lucide-react";
import axios from "axios";

const Sidebar = ({ selectedTab, onSelectTab }) => {
  const navigate = useNavigate();

  const handleLogoutClick = async (e) => {
    // TODO: Add logout logic here
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/logout");
      navigate("/");
    } catch (error) {
      console.log(`Error Logging Out --- ${error}`);
    }
    // window.location.href = "http://localhost:5000/api/auth/google";
  };

  const tabItems = [
    { name: "Gmail", icon: <EnvelopeIcon className="h-5 w-5" /> },
    {
      name: "Instagram",
      icon: <InstagramIcon className="w-5 h-5 text-black-500" />,
    },
    {
      name: "Facebook",
      icon: <FacebookIcon className="w-5 h-5 text-black-500" />,
    },
    { name: "All", icon: <InboxArrowDownIcon className="h-5 w-5" /> },
  ];

  return (
    <div className="h-screen bg-white border-r flex flex-col justify-between p-2 sm:p-4 transition-all duration-300 w-16 sm:w-64">
      {/* Top: Tabs */}
      <div>
        <h2 className="text-xl font-bold mb-4 hidden sm:block">Platforms</h2>
        {tabItems.map((tab) => (
          <button
            key={tab.name}
            className={`flex items-center sm:justify-start justify-center gap-2 sm:gap-2 w-full text-left px-2 sm:px-4 py-2 rounded-lg transition ${
              selectedTab === tab.name
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "hover:bg-gray-100"
            }`}
            onClick={() => onSelectTab(tab.name)}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Bottom: Logout */}
      <div className="mt-8 flex justify-center sm:justify-start">
        <MainBtn onClick={handleLogoutClick}>
          <span className="hidden sm:inline">Logout</span>
          <ArrowLeftStartOnRectangleIcon className="w-5 h-5 sm:hidden" />
        </MainBtn>
      </div>
    </div>
  );
};

export default Sidebar;
