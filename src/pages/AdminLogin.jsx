// src/pages/AdminLogin.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ALLOWED_ADMIN_EMAILS = ["admin@gov.in"]; // change to your list

export default function AdminLogin() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogin = async () => {
    const res = await login("admin");
    if (!res?.ok) return;

    if (ALLOWED_ADMIN_EMAILS.includes(user?.email)) {
      navigate("/admin");
    } else {
      alert("You are not authorized as admin.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <button
        onClick={handleAdminLogin}
        className="px-6 py-3 rounded-lg bg-purple-600 text-white"
      >
        Login as Government Admin
      </button>
    </div>
  );
}
