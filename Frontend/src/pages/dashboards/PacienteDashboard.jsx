import React, { useContext } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaCalendarCheck, FaUserCircle, FaHistory, FaSmile } from 'react-icons/fa';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';

const PacienteDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#eef6f6', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container fluid className="py-4 px-0" style={{ maxWidth: 900 }}>
          <Row className="align-items-center mb-5">
            <Col xs={12} className="text-center">
              <h1 style={{ color: '#49b6b2', fontWeight: 800, fontSize: 38, marginBottom: 12, letterSpacing: 1 }}>
                ¡Bienvenido, {user?.Nombre || 'Paciente'}! <FaSmile color="#49b6b2" style={{ marginLeft: 10, marginBottom: 6 }} />
              </h1>
              <h4 style={{ color: '#7d7e7d', fontWeight: 500, marginBottom: 18 }}>
                Nos alegra verte de nuevo. Aquí puedes gestionar tus citas, ver tu historial y actualizar tu perfil fácilmente.
              </h4>
            </Col>
          </Row>
          <Row className="g-4">
            <Col xs={12} md={4}>
              <Card className="h-100 shadow-sm" style={{ borderRadius: 18, cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => navigate('/agendar-cita')}>
                <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                  <FaCalendarCheck size={48} color="#49b6b2" className="mb-3" />
                  <h5 className="mb-2" style={{ fontWeight: 700 }}>Agendar Cita</h5>
                  <p className="text-muted text-center">Solicita una nueva cita con tu especialista de confianza.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={4}>
              <Card className="h-100 shadow-sm" style={{ borderRadius: 18, cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => navigate('/mis-citas')}>
                <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                  <FaHistory size={48} color="#49b6b2" className="mb-3" />
                  <h5 className="mb-2" style={{ fontWeight: 700 }}>Mis Citas</h5>
                  <p className="text-muted text-center">Consulta el estado y detalles de tus próximas y pasadas citas.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={4}>
              <Card className="h-100 shadow-sm" style={{ borderRadius: 18, cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => navigate('/perfil')}>
                <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                  <FaUserCircle size={48} color="#49b6b2" className="mb-3" />
                  <h5 className="mb-2" style={{ fontWeight: 700 }}>Mi Perfil</h5>
                  <p className="text-muted text-center">Actualiza tus datos personales y mantente al día.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default PacienteDashboard; 