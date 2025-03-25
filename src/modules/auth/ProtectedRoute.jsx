import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Obtener el token de sessionStorage
  const token = sessionStorage.getItem("token");

  // Si no hay token, redirigir al login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Si hay token, renderizar el contenido protegido
  return children;
};

export default ProtectedRoute;
