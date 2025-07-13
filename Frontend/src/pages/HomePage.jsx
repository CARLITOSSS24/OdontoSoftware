import React, { useState } from 'react';
import { Carousel, Container, Button, Collapse } from 'react-bootstrap';
import { FaTooth, FaRegSmile } from 'react-icons/fa';
import { Link } from "react-router-dom";
import Odo1 from '../assets/img/Odo_1.jpg';
import Odo2 from '../assets/img/Odo_2.jpg';
import Odo3 from '../assets/img/Odo_3.jpg';
import Login from '../components/Login';
import Register from '../components/Register';
import Footer from '../components/Footer';
import PublicNavBar from '../components/NavBar/NavBarPublico'; 

const images = [Odo1, Odo2, Odo3];

const palette = {
  primary: '#556f70',
  secondary: '#49b6b2',
  light: '#eef6f6',
  accent: '#95bfbd',
  gray: '#7d7e7d',
  grayLight: '#8c9694',
};

const HomePage = () => {
  const [showForm, setShowForm] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [bounce, setBounce] = useState(false);

  // Mostrar/ocultar formulario con animación
  const handleShowForm = () => {
    setShowForm(!showForm);
    setBounce(true);
    setTimeout(() => setBounce(false), 400);
  };

  // Cierra el formulario
  const handleCloseForm = () => setShowForm(false);

  return (
    <div style={{ minHeight: '100vh', background: palette.light }}>
      {/* NAV */}
      <PublicNavBar onShowForm={handleShowForm} bounce={bounce} />

      {/* FORMULARIO DESPLEGABLE */}
      <Collapse in={showForm}>
        <div
          style={{
            position: 'absolute',
            right: 30,
            top: 70,
            zIndex: 100,
            minWidth: 340,
            maxWidth: 400,
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 8px 32px rgba(85,111,112,0.18)',
            padding: '2rem 1.5rem',
            animation: bounce ? 'bounceIn 0.4s' : 'none',
          }}
        >
          <div className="mb-3 d-flex justify-content-between">
            <Button
              variant={isLogin ? "primary" : "outline-primary"}
              style={{
                background: isLogin ? palette.secondary : '#fff',
                color: isLogin ? '#fff' : palette.primary,
                border: 'none',
                borderRadius: 20,
                fontWeight: 600,
                marginRight: 8,
              }}
              onClick={() => setIsLogin(true)}
            >
              Iniciar sesión
            </Button>
            <Button
              variant={!isLogin ? "primary" : "outline-primary"}
              style={{
                background: !isLogin ? palette.secondary : '#fff',
                color: !isLogin ? '#fff' : palette.primary,
                border: 'none',
                borderRadius: 20,
                fontWeight: 600,
              }}
              onClick={() => setIsLogin(false)}
            >
              Registrarse
            </Button>
            <Button
              variant="link"
              style={{ color: palette.gray, marginLeft: 'auto', fontSize: 22, textDecoration: 'none' }}
              onClick={handleCloseForm}
              aria-label="Cerrar"
            >
              ×
            </Button>
          </div>
          <div>
            {isLogin ? <Login /> : <Register />}
          </div>
        </div>
      </Collapse>

      {/* CARRUSEL */}
      <Container className="mt-4 mb-5 d-flex justify-content-center">
        <div style={{
          width: '100%',
          maxWidth: 1400,
          minHeight: 'unset',
          borderRadius: 32,
          overflow: 'hidden',
          boxShadow: '0 4px 32px rgba(85,111,112,0.10)',
          background: '#fff'
        }}>
          <Carousel fade indicators={true} interval={3500} style={{width: '100%'}}>
            {images.map((src, idx) => (
              <Carousel.Item key={idx}>
                <img
                  className="d-block w-100"
                  src={src}
                  alt={`slide-${idx + 1}`}
                  style={{
                    width: '100%',
                    height: '40vw',
                    maxHeight: 400,
                    minHeight: 180,
                    objectFit: 'cover',
                    borderRadius: 0,
                  }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      </Container>

      {/* CONTENEDOR INFERIOR */}
      <div
        className="d-flex flex-column align-items-center justify-content-center mx-auto"
        style={{
          maxWidth: 500,
          background: 'rgba(238,246,246,0.85)',
          borderRadius: 18,
          padding: '2rem 1.5rem',
          boxShadow: '0 2px 16px rgba(73,182,178,0.08)',
          marginBottom: 40,
        }}
      >
        <h2
          className="mb-3 text-center"
          style={{
            color: palette.primary,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          Bienvenido a Odontomedical
        </h2>
        <Button
          variant="primary"
          style={{
            background: palette.secondary,
            border: 'none',
            borderRadius: 20,
            fontWeight: 600,
            fontSize: 18,
            padding: '0.5rem 2.5rem',
            color: '#fff',
            boxShadow: '0 2px 8px rgba(73,182,178,0.10)',
          }}
        >
          Agendar cita
        </Button>
      </div>

      {/* CUADROS DE INFORMACIÓN */}
      <div
        className="d-flex flex-wrap justify-content-center gap-4 mb-5"
        style={{ maxWidth: 1100, margin: "0 auto" }}
      >
        <div
          style={{
            flex: "1 1 320px",
            minWidth: 220,
            maxWidth: 400,
            width: '100%',
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 2px 16px rgba(73,182,178,0.08)",
            padding: "2rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <FaTooth size={48} color={palette.secondary} className="mb-3" />
          <p style={{ color: palette.gray, fontWeight: 500, textAlign: "center" }}>
            Especialistas en tu salud bucal
            Ofrecemos tratamientos de Periodoncia 
            e Implantología con tecnología avanzada 
            y atención personalizada.
          </p>
        </div>
        <div
          style={{
            flex: "1 1 320px",
            minWidth: 280,
            maxWidth: 400,
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 2px 16px rgba(73,182,178,0.08)",
            padding: "2rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <FaRegSmile size={48} color={palette.accent} className="mb-3" />
          <p style={{ color: palette.gray, fontWeight: 500, textAlign: "center" }}>
            Sonrisas que transforman vidas
            Cuidamos tu bienestar con un enfoque 
            humano, profesional y centrado en tus necesidades.
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default HomePage;