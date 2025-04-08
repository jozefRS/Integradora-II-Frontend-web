import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Package, Users, LogOut, DollarSign, ShoppingCart } from 'lucide-react';
import './Sidebar.css';
import logo from '../../assets/image.png';

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false); // Mantener el estado de la expansión
  const [userRole, setUserRole] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener el rol y correo del usuario desde sessionStorage
    const role = sessionStorage.getItem("rol");
    const email = sessionStorage.getItem("userEmail");

    if (role) setUserRole(role); // Establecer el rol solo si existe
    if (email) setUserEmail(email); // Establecer el correo solo si existe
  }, []);

  const toggleSidebar = () => {
    setExpanded(!expanded); // Alternar entre expandido y colapsado
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleNavigation = (e, path) => {
    if (!expanded) {
      e.preventDefault(); // Previene la navegación si la sidebar está colapsada
      return;
    }
  };

  const navigateTo = (path) => {
    if (expanded) {
      navigate(path);
    }
  };

  const handleLogout = () => {
    // Eliminar los datos de sesión
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("rol");
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("userName");

    // Redirigir al login
    navigate("/login");
  };

  return (
    <div className={`sidebar ${expanded ? 'expanded' : 'collapsed'}`} onClick={toggleSidebar}>
      <div className="sidebar-header">
        {/* Este es el logo que ya no debe ser el ícono de hamburguesa */}
        <div className="logo-container">
          <img src={logo || "/placeholder.svg"} alt="Zaziderma" className="sidebar-logo" />
          {expanded && <span className="sidebar-title">Zaziderma</span>}
        </div>
      </div>
      <div className="sidebar-menu">
        {/* Link para Dashboard (si es Admin o Trabajador) */}
        {userRole === "ADMIN" && (
          <Link to="/dashboard" className={`sidebar-item ${isActive('/dashboard') ? 'active' : ''}`} onClick={(e) => handleNavigation(e, '/dashboard')}>
            <Home size={22} />
            {expanded && <span>Dashboard</span>}
          </Link>
        )}

        {/* Link para Catalogo (Accesible por Admin y Trabajador) */}
        {(userRole === "ADMIN" || userRole === "TRABAJADOR") && (
          <Link to="/catalogo" className={`sidebar-item ${isActive('/catalogo') ? 'active' : ''}`} onClick={(e) => handleNavigation(e, '/catalogo')}>
            <BookOpen size={22} />
            {expanded && <span>Catalogo</span>}
          </Link>
        )}

        {/* Link para Productos (Solo Admin) */}
        {userRole === "ADMIN" && (
          <Link to="/products" className={`sidebar-item ${isActive('/products') ? 'active' : ''}`} onClick={(e) => handleNavigation(e, '/products')}>
            <Package size={22} />
            {expanded && <span>Productos</span>}
          </Link>
        )}

        {/* Link para Clientes (Accesible por Admin y Trabajador) */}
        {(userRole === "ADMIN" || userRole === "TRABAJADOR") && (
          <Link to="/clients" className={`sidebar-item ${isActive('/clients') ? 'active' : ''}`} onClick={(e) => handleNavigation(e, '/clients')}>
            <div className="icon-container">
              <Users size={22} className="icon-base" />
              <DollarSign size={12} className="icon-overlay" />
            </div>
            {expanded && <span>Clientes</span>}
          </Link>
        )}

        {/* Link para Usuarios (Solo Admin) */}
        {userRole === "ADMIN" && (
          <div className={`sidebar-item ${isActive('/users') ? 'active' : ''}`} onClick={() => navigateTo('/users')} style={{ cursor: 'pointer' }}>
            <Users size={22} />
            {expanded && <span>Usuarios</span>}
          </div>
        )}

        {/* Link para Venta (Solo Trabajador) */}
        {userRole === "TRABAJADOR" && (
          <div className={`sidebar-item ${isActive('/venta') ? 'active' : ''}`} onClick={() => navigateTo('/venta')} style={{ cursor: 'pointer' }}>
            <ShoppingCart size={22} />
            {expanded && <span>Venta</span>}
          </div>
        )}

        {/* Link para Venta (Solo Trabajador) */}
        {userRole === "ADMIN" && (
          <div className={`sidebar-item ${isActive('/ventas') ? 'active' : ''}`} onClick={() => navigateTo('/ventas')} style={{ cursor: 'pointer' }}>
            <ShoppingCart size={22} />
            {expanded && <span>Ventas</span>}
          </div>
        )}
      </div>
      <div className="sidebar-footer">
        {expanded ? (
          <div className="user-info">
            <span className="user-email">{userEmail}</span> {/* Solo el correo */}
          </div>
        ) : (
          <LogOut size={22} />
        )}
        {/* Botón de cerrar sesión */}
        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={22} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
