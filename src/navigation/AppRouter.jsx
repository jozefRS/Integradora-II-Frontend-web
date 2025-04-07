import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../modules/auth/screens/Login';
import CatalogoProductos from '../modules/products/screens/CatalogoProductos';
import GestionUsuarios from '../modules/auth/screens/GestionUsuarios';
<<<<<<< HEAD
import ProtectedRoute from '../modules/auth/ProtectedRoute';  // Asegúrate de importar esto
import GestionClientes from '../modules/clients/screens/GestionClientes';
import Dashboard from '../modules/dashboard/screens/Dashboard';
import GestionProductos from '../modules/products/screens/GestionProductos';
import GestionVentas from '../modules/trabajador/venta/GestionVentas';
import AGestionVentas from '../modules/ventaAdmin/AGestionVentas';

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
         <Route 
          path="/ventas" 
          element={
            <ProtectedRoute allowedRoles={'ADMIN'}>
              <AGestionVentas />
            </ProtectedRoute>
          }
        />
       
        

=======
import GestionClientes from '../modules/clients/screens/GestionClientes';
import GestionProductos from '../modules/products/screens/GestionProductos';

const AppRouter = () => {
  // Por ahora, no verificamos autenticación para que puedas probar las vistas
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/products" element={<CatalogoProductos />} />
        <Route path="/users" element={<GestionUsuarios />} />
        <Route path='/clients' element={<GestionClientes/>}/> 
        <Route path='/inventario' element={<GestionProductos/>}/> 
        
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51
        {/* Ruta de fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

<<<<<<< HEAD
export default AppRouter;
=======
export default AppRouter;
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51
