import React from "react";

const Header = () => {
  return (
    <header className="bg-white shadow px-4 py-3 flex justify-between items-center">
      <h2 className="text-lg font-medium">Dashboard</h2>
      <button className="text-sm text-red-600 font-semibold hover:underline">
        Logout
      </button>
    </header>
  );
};

export default Header;
