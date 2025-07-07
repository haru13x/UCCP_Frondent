// src/router/middleware.jsx
import { Navigate } from "react-router-dom";
import { useEffect } from "react";

const getUserPermissions = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.role?.role_permissions?.map((rp) => rp.permission?.code) || [];
  } catch (e) {
    return [];
  }
};

const Middleware = ({ element, isPublic = false, rule = null }) => {
  const token = localStorage.getItem("api_token");
  const permissions = getUserPermissions();

  // Public route: always allow
  if (isPublic) return element;

  // Not authenticated
  if (!token) return <Navigate to="/" replace />;

  // Authenticated but lacks permission
  if (rule && !permissions.includes(rule)) {
    return <Navigate to="/no-permission" replace />;
  }

  return element;
};

export default Middleware;
