import React, { useState, useContext } from "react";
import api from "../API/axiosInstance";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";
import { Modal, Button } from 'react-bootstrap';

const palette = {
  primary: '#556f70',
  secondary: '#49b6b2',
  light: '#eef6f6',
  accent: '#95bfbd',
  gray: '#7d7e7d',
  grayLight: '#8c9694',
};

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showRecuperar, setShowRecuperar] = useState(false);
  const [recCorreo, setRecCorreo] = useState("");
  const [recStep, setRecStep] = useState(1); // 1: pedir correo, 2: pedir código y nueva clave
  const [recCodigo, setRecCodigo] = useState("");
  const [recNuevaClave, setRecNuevaClave] = useState("");
  const [recError, setRecError] = useState("");
  const [recSuccess, setRecSuccess] = useState("");
  const [recLoading, setRecLoading] = useState(false);
  const [recDocumento, setRecDocumento] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/login", {
        Correo: correo,
        Clave: clave
      });

      const { token } = res.data;
      if (!token) {
        setError("Credenciales incorrectas.");
        return;
      }

      const decoded = jwtDecode(token);
      const rol = decoded.Permiso;

      // Primero hacer login para establecer el estado
      login(token);

      // Esperar a que el estado se actualice
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Luego redirigir según el rol
      switch (rol) {
        case "ADMIN":
          window.location.href = "/admin/dashboard";
          break;
        case "DOCTORA":
          window.location.href = "/doctora/dashboard";
          break;
        case "RECEPCIONISTA":
          window.location.href = "/recepcionista/dashboard";
          break;
        case "PACIENTE":
          window.location.href = "/paciente/dashboard";
          break;
        default:
          window.location.href = "/unauthorized";
      }
    } catch (err) {
      console.error("Error de login:", err);
      setError(err.response?.data?.message || "Credenciales incorrectas o error de servidor.");
    }
  };

  const handleRecuperar = async (e) => {
    e.preventDefault();
    setRecError("");
    setRecSuccess("");
    setRecLoading(true);
    try {
      await api.post("/login/solicitar-codigo", { correo: recCorreo, documento: recDocumento });
      setRecStep(2);
      setRecSuccess("Código enviado al correo. Revisa tu bandeja de entrada.");
    } catch (err) {
      setRecError(err.response?.data?.mensaje || "Error al enviar el código");
    }
    setRecLoading(false);
  };

  const handleRestablecer = async (e) => {
    e.preventDefault();
    setRecError("");
    setRecSuccess("");
    setRecLoading(true);
    try {
      await api.post("/login/restablecer-contrasena", {
        correo: recCorreo,
        codigo: recCodigo,
        nuevaClave: recNuevaClave
      });
      setRecSuccess("¡Contraseña restablecida! Ya puedes iniciar sesión.");
      setTimeout(() => {
        setShowRecuperar(false);
        setRecStep(1);
        setRecCorreo("");
        setRecCodigo("");
        setRecNuevaClave("");
        setRecError("");
        setRecSuccess("");
      }, 2000);
    } catch (err) {
      setRecError(err.response?.data?.mensaje || "Error al restablecer contraseña");
    }
    setRecLoading(false);
  };

  return (
    <div
      style={{
        background: palette.light,
        borderRadius: 18,
        boxShadow: '0 4px 24px rgba(85,111,112,0.10)',
        padding: '2.5rem 2rem',
        maxWidth: 380,
        margin: '0 auto',
      }}
    >
      <h2
        className="mb-4 text-center"
        style={{
          color: palette.primary,
          fontWeight: 700,
          letterSpacing: 1,
        }}
      >
        Iniciar Sesión
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label style={{ color: palette.gray, fontWeight: 500 }}>Correo</label>
          <input
            type="email"
            className="form-control"
            style={{
              borderRadius: 12,
              border: `1.5px solid ${palette.accent}`,
              background: palette.light,
              color: palette.primary,
              fontWeight: 500,
            }}
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div className="mb-3">
          <label style={{ color: palette.gray, fontWeight: 500 }}>Clave</label>
          <input
            type="password"
            className="form-control"
            style={{
              borderRadius: 12,
              border: `1.5px solid ${palette.accent}`,
              background: palette.light,
              color: palette.primary,
              fontWeight: 500,
            }}
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        {error && (
          <div
            className="alert"
            style={{
              background: palette.grayLight,
              color: "#fff",
              borderRadius: 10,
              padding: "0.5rem 1rem",
              fontWeight: 500,
              marginBottom: 12,
              border: "none"
            }}
          >
            {error}
          </div>
        )}
        <button
          type="submit"
          className="btn w-100"
          style={{
            background: palette.secondary,
            color: "#fff",
            border: "none",
            borderRadius: 20,
            fontWeight: 600,
            fontSize: 18,
            padding: "0.5rem 0",
            boxShadow: '0 2px 8px rgba(73,182,178,0.10)',
            transition: "background 0.2s"
          }}
        >
          Ingresar
        </button>
      </form>
      <div className="mt-3 text-center">
        <button
          type="button"
          className="btn btn-link p-0"
          style={{ color: palette.primary, fontWeight: 500, textDecoration: 'underline', fontSize: 15 }}
          onClick={() => setShowRecuperar(true)}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>
      {/* Modal de recuperación */}
      <Modal show={showRecuperar} onHide={() => { setShowRecuperar(false); setRecStep(1); setRecError(""); setRecSuccess(""); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Recuperar Contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {recStep === 1 && (
            <form onSubmit={handleRecuperar}>
              <div className="mb-3">
                <label>Correo electrónico</label>
                <input
                  type="email"
                  className="form-control"
                  value={recCorreo}
                  onChange={e => setRecCorreo(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label>Documento de identificación</label>
                <input
                  type="text"
                  className="form-control"
                  value={recDocumento}
                  onChange={e => setRecDocumento(e.target.value)}
                  required
                />
              </div>
              {recError && <div className="alert alert-danger">{recError}</div>}
              {recSuccess && <div className="alert alert-success">{recSuccess}</div>}
              <Button type="submit" variant="primary" disabled={recLoading} className="w-100">
                {recLoading ? 'Enviando...' : 'Enviar código'}
              </Button>
            </form>
          )}
          {recStep === 2 && (
            <form onSubmit={handleRestablecer}>
              <div className="mb-3">
                <label>Código recibido</label>
                <input
                  type="text"
                  className="form-control"
                  value={recCodigo}
                  onChange={e => setRecCodigo(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label>Nueva contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  value={recNuevaClave}
                  onChange={e => setRecNuevaClave(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              {recError && <div className="alert alert-danger">{recError}</div>}
              {recSuccess && <div className="alert alert-success">{recSuccess}</div>}
              <Button type="submit" variant="success" disabled={recLoading} className="w-100">
                {recLoading ? 'Restableciendo...' : 'Restablecer contraseña'}
              </Button>
            </form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Login;