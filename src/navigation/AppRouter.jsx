import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../modules/auth/screens/Login';
import CatalogoProductos from '../modules/products/screens/CatalogoProductos';
import GestionUsuarios from '../modules/auth/screens/GestionUsuarios';
import ProtectedRoute from '../modules/auth/ProtectedRoute';  // Asegúrate de importar esto

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas */}
        <Route 
          path="/products" 
          element={<ProtectedRoute><CatalogoProductos /></ProtectedRoute>} 
        />
        <Route 
          path="/users" 
          element={<ProtectedRoute><GestionUsuarios /></ProtectedRoute>} 
        />

        {/* Ruta de fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
