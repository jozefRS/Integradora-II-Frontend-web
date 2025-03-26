import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Clipboard, Users, Settings, LogOut, Menu, DollarSign, ShoppingBag } from 'lucide-react';
import './Sidebar.css';
import logo from '../../assets/image.png';

const Sidebar = ({ userName = "Richard", userEmail = "richard@gmail.com" }) => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setExpanded(!expanded);
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

  return (
    <div className={`sidebar ${expanded ? 'expanded' : 'collapsed'}`}> 
      <div className="sidebar-header">
        <button className="menu-button" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <div className="logo-container">
          <img src={logo || "/placeholder.svg"} alt="Zaziderma" className="sidebar-logo" />
          {expanded && <span className="sidebar-title">Zaziderma</span>}
        </div>
      </div>
      <div className="sidebar-menu">
        <Link to="/dashboard" className={`sidebar-item ${isActive('/dashboard') ? 'active' : ''}`} onClick={(e) => handleNavigation(e, '/dashboard')}>
          <Home size={22} />
          {expanded && <span>Dashboard</span>}
        </Link>
        <Link to="/products" className={`sidebar-item ${isActive('/products') ? 'active' : ''}`} onClick={(e) => handleNavigation(e, '/products')}>
          <Clipboard size={22} />
          {expanded && <span>Inventario</span>}
          {!expanded && isActive('/products') && <div className="active-indicator"></div>}
        </Link>
        <Link to="/inventario" className={`sidebar-item ${isActive('/inventario') ? 'active' : ''}`} onClick={(e) => handleNavigation(e, '/inventario')}>
          <ShoppingBag size={22} />
          {expanded && <span>Gestion de productos</span>}
          {!expanded && isActive('/inventario') && <div className="active-indicator"></div>}
        </Link>
        <Link to="/clients" className={`sidebar-item ${isActive('/clients') ? 'active' : ''}`} onClick={(e) => handleNavigation(e, '/clients')}>
        <div className="icon-container">
          <Users size={22} className="icon-base" />
          <DollarSign size={12} className="icon-overlay" />
        </div>
          {expanded && <span>Clientes</span>}
          {!expanded && isActive('/clients') && <div className="active-indicator"></div>}
        </Link>
        <div className={`sidebar-item ${isActive('/users') ? 'active' : ''}`} onClick={() => navigateTo('/users')} style={{ cursor: 'pointer' }}>
          <Users size={22} />
          {expanded && <span>Usuarios</span>}
          {!expanded && isActive('/users') && <div className="active-indicator"></div>}
        </div>
        <div className={`sidebar-item ${isActive('/settings') ? 'active' : ''}`} onClick={() => navigateTo('/settings')} style={{ cursor: 'pointer' }}>
          <Settings size={22} />
          {expanded && <span>Ajustes</span>}
          {!expanded && isActive('/settings') && <div className="active-indicator"></div>}
        </div>
      </div>
      <div className="sidebar-footer">
        {expanded ? (
          <div className="user-info">
            <span className="user-name">{userName}</span>
            <span className="user-email">{userEmail}</span>
          </div>
        ) : (
          <LogOut size={22} />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
