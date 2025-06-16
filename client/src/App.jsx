// src/SignInForm.jsx
import React from "react";
import SignUpForm from "./pages/SignUpForm";
import LoginForm from "./pages/LoginForm";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import PrivateRoute from "./components/PrivateRoutes";

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" index element={<LoginForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signUp" element={<SignUpForm />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  {/* Protects the Dashboard route from users not logged In */}
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
