// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Loading from "C:/Users/acer/Desktop/snapscholor/client/SNAP-SCHOLOR/src/components/Loading.jsx"
function ProtectedRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const users = await fetch("http://localhost:5000/api/saferoute", {
          method: "POST",
          credentials: "include", // 👈 sends cookie with request
        });

        if (users.ok) {
          setIsAuthenticated(true);
        } else {
          alert("Why So Haar!!!  Login First Please")
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div><Loading /></div>; // optional spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/"  />; // redirect to login
  }

  return children; // allow access
}

export default ProtectedRoute;
