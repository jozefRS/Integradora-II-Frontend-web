import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  // Obtener el token y el rol desde sessionStorage
  const token = sessionStorage.getItem("token");
  const rol = sessionStorage.getItem("rol");

  // Si no hay token o el rol no es el permitido, redirigir al login
  if (!token || !allowedRoles.includes(rol)) {
    return <Navigate to="/login" />;
  }

  // Si hay token y el rol es permitido, renderizar el contenido protegido
  return children;
};

export default ProtectedRoute;
