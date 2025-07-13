import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUserCog, FaUser, FaConciergeBell, FaKey, FaHistory, FaUserMd, FaClinicMedical, FaCalendarAlt, FaSignOutAlt } from "react-icons/fa";
import { AuthContext } from "../../contexts/AuthContext";

const defaultColorScheme = {
  primary: '#556f70',
  secondary: '#95bfbd',
  accent: '#49b6b2',
  light: '#eef6f6',
  dark: '#7d7e7d',
};

const getMenuItems = (rol) => {
  if (rol === "ADMIN") {
    return [
      { path: '/admin/dashboard', label: 'Dashboard', icon: <FaUserCog className="me-2" /> },
      { path: '/admin/usuarios', label: 'Usuarios', icon: <FaUser className="me-2" /> },
      { path: '/admin/citas', label: 'Citas', icon: <FaCalendarAlt className="me-2" /> },
      { path: '/admin/servicios', label: 'Servicios', icon: <FaConciergeBell className="me-2" /> },
      { path: '/admin/doctores', label: 'Doctores', icon: <FaUserMd className="me-2" /> },
      { path: '/admin/consultorios', label: 'Consultorios', icon: <FaClinicMedical className="me-2" /> },
      { path: '/admin/historiales', label: 'Historiales', icon: <FaHistory className="me-2" /> },
    ];
  }
  if (rol === "DOCTORA") {
    return [
      { path: '/doctora/dashboard', label: 'Dashboard', icon: <FaUserCog className="me-2" /> },
      { path: '/doctora/mis-citas', label: 'Mis Citas', icon: <FaCalendarAlt className="me-2" /> },
      { path: '/doctora/historiales', label: 'Historiales', icon: <FaHistory className="me-2" /> },
    ];
  }
  // RECEPCIONISTA
  return [
    { path: '/recepcionista/dashboard', label: 'Dashboard', icon: <FaUserCog className="me-2" /> },
    { path: '/recepcionista/citas', label: 'Citas', icon: <FaCalendarAlt className="me-2" /> },
    { path: '/recepcionista/historiales', label: 'Historiales', icon: <FaHistory className="me-2" /> },
    { path: '/recepcionista/consultorios', label: 'Consultorios', icon: <FaClinicMedical className="me-2" /> },
  ];
};

const NavBarCrud = ({
  userRol = ""
}) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const menuItems = getMenuItems(userRol);

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div style={{
      width: 220,
      background: 'linear-gradient(135deg, #556f70 0%, #49b6b2 100%)',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem 0 1.5rem 0',
      boxShadow: '2px 0 12px rgba(85,111,112,0.08)',
      position: 'sticky',
      top: 0,
      height: '100vh',
      zIndex: 10
    }}>
      <div style={{ marginBottom: 40, display: 'flex', alignItems: 'center', gap: 10 }}>
        <FaUserCog size={28} />
        <span style={{ fontWeight: 700, fontSize: 22 }}>
          {userRol === 'ADMIN' ? 'Admin' : userRol === 'DOCTORA' ? 'Doctora' : userRol === 'RECEPCIONISTA' ? 'Recepción' : ''}
        </span>
      </div>
      <nav style={{ width: '100%', flex: 1 }}>
        {menuItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 28px',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: 17,
              borderRadius: 12,
              margin: '6px 0',
              transition: 'background 0.2s',
              background: location.pathname === item.path ? 'rgba(255,255,255,0.10)' : 'none',
            }}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        style={{
          marginTop: 'auto',
          background: '#fff',
          color: '#556f70',
          border: 'none',
          borderRadius: 8,
          fontWeight: 700,
          fontSize: 16,
          boxShadow: '0 2px 8px rgba(85,111,112,0.10)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '80%',
          justifyContent: 'center',
          padding: '10px 0',
          position: 'absolute',
          bottom: 30,
          left: '10%',
        }}
      >
        <FaSignOutAlt className="me-2" />
        Cerrar sesión
      </button>
    </div>
  );
};

export default NavBarCrud;