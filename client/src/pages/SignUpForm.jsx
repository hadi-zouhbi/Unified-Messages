import React, { useState } from "react";
// import logo from "../assets/Logo.jpg";
import MainBtn from "../components/MainBtn";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password length check
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    // Clear error if password is valid
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/createNewUser`,
        { email, password }
      );
      console.log("User created:", response.data);
      alert("User created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error signing up:", error.response?.data || error.message);
      alert("Signup failed.");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
          {/* <div className="flex justify-center mb-6">
            <img src={logo} alt="Logo" className="h-16" />
          </div> */}
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
            Sign Up
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
            <MainBtn type="submit">Sign Up</MainBtn>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUpForm;
