import { FaUserMd, FaBars } from 'react-icons/fa';
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { Button } from "react-bootstrap";

const palette = {
  primary: '#556f70',
  secondary: '#49b6b2',
};

const PublicNavBar = ({ onShowForm, bounce }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Cierra el menú cuando se hace click en un link
  const handleLinkClick = () => setMenuOpen(false);

  return (
    <nav
      className="d-flex justify-content-between align-items-center px-4 py-3"
      style={{
        background: palette.primary,
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        position: "relative",
        zIndex: 100,
        flexWrap: 'wrap',
      }}
    >
      {/* Icono Doctor a la izquierda */}
      <div className="d-flex align-items-center">
        {/* Hamburguesa solo en pantallas pequeñas */}
        <div className="d-lg-none me-3" style={{ cursor: "pointer" }} onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars size={26} color="#fff" />
        </div>
        <FaUserMd size={32} color="#fff" />
      </div>
      {/* Links de navegación en grande */}
      <div className="d-none d-lg-flex align-items-center gap-3">
        <Link
          to="/"
          style={{
            color: "#fff",
            fontWeight: 600,
            textDecoration: "none",
            marginRight: 18,
            letterSpacing: 0.5,
            transition: "color 0.2s",
          }}
        >
          Inicio
        </Link>
        <Link
          to="/nosotros"
          style={{
            color: "#fff",
            fontWeight: 600,
            textDecoration: "none",
            marginRight: 18,
            letterSpacing: 0.5,
            transition: "color 0.2s",
          }}
        >
          Nosotros
        </Link>
        <Link
          to="/contactenos"
          style={{
            color: "#fff",
            fontWeight: 600,
            textDecoration: "none",
            marginRight: 18,
            letterSpacing: 0.5,
            transition: "color 0.2s",
          }}
        >
          Contáctenos
        </Link>
        <Button
          variant="light"
          style={{
            borderRadius: 20,
            fontWeight: 600,
            color: palette.primary,
            boxShadow: bounce ? '0 0 0 4px #49b6b2aa' : 'none',
            transition: 'box-shadow 0.3s',
          }}
          onClick={() => {
            setMenuOpen(false);
            if (onShowForm) onShowForm();
          }}
          className={bounce ? 'animate__animated animate__bounce' : ''}
        >
          Iniciar sesión / Regístrese
        </Button>
      </div>
      {/* Menú hamburguesa desplegable */}
      {menuOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100vw",
            background: palette.primary,
            boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
            padding: "1.5rem 0 1rem 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            zIndex: 999,
          }}
          className="d-lg-none animate__animated animate__fadeInDown"
        >
          <Link
            to="/"
            onClick={handleLinkClick}
            style={{
              color: "#fff",
              fontWeight: 600,
              textDecoration: "none",
              padding: "0.7rem 2rem",
              width: "100%",
              display: "block",
              fontSize: 18,
            }}
          >
            Inicio
          </Link>
          <Link
            to="/nosotros"
            onClick={handleLinkClick}
            style={{
              color: "#fff",
              fontWeight: 600,
              textDecoration: "none",
              padding: "0.7rem 2rem",
              width: "100%",
              display: "block",
              fontSize: 18,
            }}
          >
            Nosotros
          </Link>
          <Link
            to="/contactenos"
            onClick={handleLinkClick}
            style={{
              color: "#fff",
              fontWeight: 600,
              textDecoration: "none",
              padding: "0.7rem 2rem",
              width: "100%",
              display: "block",
              fontSize: 18,
            }}
          >
            Contáctenos
          </Link>
          <Button
            variant="light"
            style={{
              borderRadius: 20,
              fontWeight: 600,
              color: palette.primary,
              margin: "0.7rem 2rem",
              width: "calc(100% - 4rem)",
            }}
            onClick={() => {
              setMenuOpen(false);
              if (onShowForm) onShowForm();
            }}
            className={bounce ? 'animate__animated animate__bounce' : ''}
          >
            Iniciar sesión / Regístrese
          </Button>
        </div>
      )}
    </nav>
  );
};

export default PublicNavBar;