import React, { useState } from "react";
import { Container, Row, Col, Collapse, Button } from "react-bootstrap";
import { FaUserMd, FaTooth, FaWhatsapp, FaPhone, FaGem, FaClinicMedical } from "react-icons/fa";
import PublicNavBar from "../components/NavBar/NavBarPublico";
import Footer from "../components/Footer";
import Login from "../components/Login";
import Register from "../components/Register";

const palette = {
  primary: '#556f70',
  secondary: '#49b6b2',
  light: '#eef6f6',
  accent: '#95bfbd',
  gray: '#7d7e7d',
  grayLight: '#8c9694',
};

const Contactenos = () => {
  const [showForm, setShowForm] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [bounce, setBounce] = useState(false);

  const handleShowForm = () => {
    setShowForm(!showForm);
    setBounce(true);
    setTimeout(() => setBounce(false), 400);
  };
  const handleCloseForm = () => setShowForm(false);

  return (
    <div style={{ minHeight: "100vh", background: palette.light }}>
      <PublicNavBar onShowForm={handleShowForm} bounce={bounce} />
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
      <Container className="py-5">
        <h1
          className="text-center mb-4"
          style={{
            color: palette.secondary,
            fontWeight: 900,
            letterSpacing: 1,
            fontSize: "2.7rem",
          }}
        >
          CONTACTENOS
        </h1>
        <hr
          style={{
            border: "none",
            height: 4,
            background: "linear-gradient(90deg, #49b6b2 0%, #95bfbd 100%)",
            boxShadow: "0 2px 8px #49b6b255",
            borderRadius: 8,
            margin: "2rem auto 2.5rem auto",
            width: "60%",
          }}
        />
        <Row className="justify-content-center mb-4" style={{ maxWidth: 900, margin: "0 auto" }}>
          <Col md={6} className="mb-3">
            <div
              style={{
                background: "#fff",
                borderRadius: 18,
                boxShadow: "0 2px 12px rgba(73,182,178,0.08)",
                padding: "2rem 1.5rem",
                minHeight: 180,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                gap: "1.2rem",
                fontSize: "1.15rem"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <FaClinicMedical color={palette.secondary} size={28} />
                <span style={{ color: palette.primary, fontWeight: 700 }}>Odontomedical</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <FaUserMd color={palette.secondary} size={24} />
                <span style={{ color: palette.gray, fontWeight: 600 }}>Medical & health</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <FaUserMd color={palette.secondary} size={24} />
                <span style={{ color: palette.primary, fontWeight: 600 }}>Dra. Yamile Guzmán.</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <FaGem color={palette.accent} size={22} />
                <span style={{ color: palette.gray, fontWeight: 600 }}>Especialista en Periodoncia e Implantologia.</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <FaTooth color={palette.secondary} size={22} />
                <span style={{ color: palette.gray, fontWeight: 600 }}>Clínica odontomedical.</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <FaWhatsapp color="#25D366" size={22} />
                <span style={{ color: palette.primary, fontWeight: 600 }}>3134833332</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <FaPhone color={palette.secondary} size={22} />
                <span style={{ color: palette.primary, fontWeight: 600 }}>41247 87</span>
              </div>
            </div>
          </Col>
        </Row>
        <hr
          style={{
            border: "none",
            height: 4,
            background: "linear-gradient(90deg, #49b6b2 0%, #95bfbd 100%)",
            boxShadow: "0 2px 8px #49b6b255",
            borderRadius: 8,
            margin: "2rem auto 2.5rem auto",
            width: "60%",
          }}
        />
        <div className="d-flex justify-content-center mb-5">
          <div style={{position: 'relative', width: '100%', maxWidth: 800, paddingBottom: '56.25%', height: 0}}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!3m2!1ses-419!2sco!4v1747443329876!5m2!1ses-419!2sco!6m8!1m7!1sSHy4WHee9iF7VHqcMx5qnQ!2m2!1d4.668835086208158!2d-74.11678069476511!3f146.5938034140564!4f-10.822863944370098!5f0.7820865974627469"
              style={{position: 'absolute', top:0, left:0, width:'100%', height:'100%', border: 0, borderRadius: 18, boxShadow: "0 2px 16px rgba(73,182,178,0.10)"}}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Odontomedical"
            ></iframe>
          </div>
        </div>
        <hr
          style={{
            border: "none",
            height: 4,
            background: "linear-gradient(90deg, #49b6b2 0%, #95bfbd 100%)",
            boxShadow: "0 2px 8px #49b6b255",
            borderRadius: 8,
            margin: "2rem auto 2.5rem auto",
            width: "60%",
          }}
        />
      </Container>
      <Footer />
    </div>
  );
};

export default Contactenos;