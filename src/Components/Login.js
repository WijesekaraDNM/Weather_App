import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginButton = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();

  useEffect(
    () => {
      if (isAuthenticated) {
        navigate("/HomePage");
        toast.success("Login Successful!");
      }
    },
    [isAuthenticated]
  );

  return (
    <div
      style={{
        backgroundImage: `url(${"/bgImage.jpg"})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
      className="min-h-screen flex items-center justify-center px-4"
    >
      <div className="bg-black bg-opacity-20 backdrop-blur-md rounded-xl shadow-xl max-w-md w-full p-10 text-center text-white">
        <h1 className="text-4xl font-bold mb-6">Welcome to Weather App</h1>
        <p className="mb-8 text-lg">
          Please log in to access the most accurate and beautiful weather
          forecasts.
        </p>
        <button
          onClick={() => loginWithRedirect()}
          className="bg-gradient-to-r from-red-700 via-yellow-500 to-violet-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition"
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default LoginButton;
