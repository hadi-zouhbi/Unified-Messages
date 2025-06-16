import React from "react";

const MainBtn = ({ children, onClick, type = "button", className = "" }) => {
  return (
    <>
      <button
        type={type}
        onClick={onClick}
        className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 ${className} w-full cursor-pointer`}
      >
        {children}
      </button>
    </>
  );
};

export default MainBtn;
