import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../modules/auth/screens/Login';
import CatalogoProductos from '../modules/products/screens/CatalogoProductos';
import GestionUsuarios from '../modules/auth/screens/GestionUsuarios';

const AppRouter = () => {
  // Por ahora, no verificamos autenticación para que puedas probar las vistas
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/products" element={<CatalogoProductos />} />
        <Route path="/users" element={<GestionUsuarios />} />
        
        {/* Ruta de fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;