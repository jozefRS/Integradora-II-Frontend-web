import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../modules/auth/screens/Login';
import CatalogoProductos from '../modules/products/screens/CatalogoProductos';
import GestionUsuarios from '../modules/auth/screens/GestionUsuarios';
import ProtectedRoute from '../modules/auth/ProtectedRoute';  // Asegúrate de importar esto
import GestionClientes from '../modules/clients/screens/GestionClientes';
import Dashboard from '../modules/dashboard/screens/Dashboard';
import GestionProductos from '../modules/products/screens/GestionProductos';
import GestionVentas from '../modules/trabajador/venta/GestionVentas';
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas con verificación de roles */}
        <Route 
          path="/products" 
          element={
            <ProtectedRoute allowedRoles={'ADMIN'}>
              <GestionProductos />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/catalogo" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'TRABAJADOR']}>
              <CatalogoProductos />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/users" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <GestionUsuarios />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/Clients" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'TRABAJADOR']}>
              <GestionClientes />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={'ADMIN'}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/venta" 
          element={
            <ProtectedRoute allowedRoles={'TRABAJADOR'}>
              <GestionVentas />
            </ProtectedRoute>
          }
        />
       
        

        {/* Ruta de fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
