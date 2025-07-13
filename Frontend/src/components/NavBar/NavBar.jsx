import { Link, useNavigate } from "react-router-dom";
import { FaUserMd, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";

const NavBar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    // Lógica para cerrar sesión (elimina token, limpia storage, etc.)
    localStorage.removeItem("token");
    // Puedes limpiar más datos aquí si es necesario
    navigate("/");
  };

  // Links para reutilizar
  const navLinks = (
    <>
      <Link
        to="/paciente/dashboard"
        style={{
          color: "#fff",
          fontWeight: 700,
          textDecoration: "none",
          marginRight: 28,
          fontSize: 17,
          letterSpacing: 0.5,
          transition: "color 0.2s",
        }}
        onClick={() => setMenuOpen(false)}
      >
        Inicio
      </Link>
      <Link
        to="/perfil"
        style={{
          color: "#fff",
          fontWeight: 700,
          textDecoration: "none",
          marginRight: 28,
          fontSize: 17,
          letterSpacing: 0.5,
          transition: "color 0.2s",
        }}
        onClick={() => setMenuOpen(false)}
      >
        Perfil
      </Link>
      <Link
        to="/agendar-cita"
        style={{
          color: "#fff",
          fontWeight: 700,
          textDecoration: "none",
          marginRight: 28,
          fontSize: 17,
          letterSpacing: 0.5,
          transition: "color 0.2s",
        }}
        onClick={() => setMenuOpen(false)}
      >
        Servicios
      </Link>
      <Link
        to="/mis-citas"
        style={{
          color: "#fff",
          fontWeight: 700,
          textDecoration: "none",
          marginRight: 28,
          fontSize: 17,
          letterSpacing: 0.5,
          transition: "color 0.2s",
        }}
        onClick={() => setMenuOpen(false)}
      >
        Mis Citas
      </Link>
      <Link
        to="/ver-mi-historia"
        style={{
          color: "#fff",
          fontWeight: 700,
          textDecoration: "none",
          marginRight: 28,
          fontSize: 17,
          letterSpacing: 0.5,
          transition: "color 0.2s",
        }}
        onClick={() => setMenuOpen(false)}
      >
        Mi Historia
      </Link>
      <button
        onClick={() => { setMenuOpen(false); handleLogout(); }}
        style={{
          border: "none",
          outline: "none",
          background: "#eef6f6",
          color: "#556f70",
          fontWeight: 600,
          fontSize: 16,
          borderRadius: 20,
          padding: "7px 22px",
          marginLeft: 8,
          cursor: "pointer",
          transition: "background 0.2s, color 0.2s",
        }}
        onMouseOver={e => {
          e.target.style.background = "#49b6b2";
          e.target.style.color = "#fff";
        }}
        onMouseOut={e => {
          e.target.style.background = "#eef6f6";
          e.target.style.color = "#556f70";
        }}
      >
        Cerrar sesión
      </button>
    </>
  );

  return (
    <nav
      style={{
        width: "100%",
        background: "#556f70",
        padding: "12px 0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        zIndex: 100,
      }}
    >
      {/* Logo o ícono a la izquierda */}
      <div style={{ marginLeft: 32 }}>
        <FaUserMd size={32} color="#fff" />
      </div>
      {/* Menú hamburguesa en móvil */}
      <div className="navbar-desktop-links" style={{ display: "flex", alignItems: "center", gap: 0, marginRight: 32 }}>
        <div className="navbar-links-desktop" style={{ display: "none" }}>
          {navLinks}
        </div>
        <button
          className="navbar-hamburger"
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: 28,
            cursor: "pointer",
            display: "block",
          }}
          onClick={() => setMenuOpen(true)}
        >
          <FaBars />
        </button>
      </div>
      {/* Overlay menú móvil */}
      {menuOpen && (
        <div
          className="navbar-mobile-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(85, 111, 112, 0.97)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            animation: "fadeIn 0.3s",
          }}
        >
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              position: "absolute",
              top: 24,
              right: 32,
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: 36,
              cursor: "pointer",
            }}
            aria-label="Cerrar menú"
          >
            <FaTimes />
          </button>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
            {navLinks}
          </div>
        </div>
      )}
      <style>{`
        @media (min-width: 900px) {
          .navbar-hamburger { display: none !important; }
          .navbar-links-desktop { display: flex !important; gap: 0 0; }
        }
        @media (max-width: 899px) {
          .navbar-links-desktop { display: none !important; }
          .navbar-hamburger { display: block !important; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </nav>
  );
};

export default NavBar;