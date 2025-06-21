import { Navigate } from "react-router-dom";
import { useEffect } from "react";

const Middleware = ({ element, isPublic = false }) => {
  const token = localStorage.getItem("api_token");

  useEffect(() => {
    if (!isPublic && !token) {
      console.warn("Unauthorized access attempt to a private route.");
    }
  }, [isPublic, token]);

  // Public route - always allow
  if (isPublic) return element;

  // Private route - allow only if authenticated
  return token ? element : <Navigate to="/" replace />;
};

export default Middleware;
