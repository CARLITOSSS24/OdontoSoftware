import { useEffect, useState, useContext } from 'react';
import api from '../API/axiosInstance';
import { Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ModalAgendarCitaPaciente from '../components/Modales/ModalAgendarCitaPaciente';
import NavBar from '../components/NavBar/NavBar';
import Footer from '../components/Footer';
import { FaTeeth, FaTooth, FaUserMd, FaXRay, FaSmile, FaClinicMedical, FaChild, FaRegGrinStars, FaRegGrinBeam, FaRegGrinBeamSweat, FaRegGrinAlt, FaRegGrin, FaRegGrinTongue, FaRegGrinHearts } from 'react-icons/fa';

const AgendarCitas = () => {
  const [servicios, setServicios] = useState([]);
  const [doctoras, setDoctoras] = useState([]);
  const [consultorios, setConsultorios] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServicios();
    fetchDoctoras();
    fetchConsultorios();
  }, []);

  const fetchServicios = async () => {
    try {
      const response = await api.get('/servicio');
      setServicios(response.data.filter(s => s.Disponible === 'Activo'));
    } catch {}
  };
  const fetchDoctoras = async () => {
    try {
      const response = await api.get('/doctora');
      setDoctoras(response.data);
    } catch {}
  };
  const fetchConsultorios = async () => {
    try {
      const response = await api.get('/consultorios');
      setConsultorios(response.data);
    } catch {}
  };

  const handleAgendar = (servicio) => {
    setServicioSeleccionado(servicio);
    setShowModal(true);
  };

  const handleCitaAgendada = () => {
    setError(null);
    setSuccess('Cita agendada correctamente.');
    setShowModal(false);
    setTimeout(() => navigate('/mis-citas'), 1200);
  };

  // Mapeo de íconos por servicio
  const iconosServicios = {
    Ortodoncia: <FaTeeth size={38} color="#49b6b2" />,
    'Limpieza Dental': <FaTooth size={38} color="#49b6b2" />,
    'Consulta Odontológica General': <FaClinicMedical size={38} color="#49b6b2" />,
    'Limpieza Dental Profilaxis': <FaTooth size={38} color="#49b6b2" />,
    'Radiografías Dentales': <FaXRay size={38} color="#49b6b2" />,
    'Resinas o Restauraciones Estéticas': <FaSmile size={38} color="#49b6b2" />,
    'Extracciones Dentales': <FaRegGrinBeamSweat size={38} color="#49b6b2" />,
    Endodoncia: <FaRegGrinStars size={38} color="#49b6b2" />,
    'Blanqueamiento Dental': <FaRegGrinHearts size={38} color="#49b6b2" />,
    'Prótesis Dentales': <FaRegGrinAlt size={38} color="#49b6b2" />,
    'Implantes Dentales': <FaRegGrin size={38} color="#49b6b2" />,
    Periodoncia: <FaRegGrinTongue size={38} color="#49b6b2" />,
    Odontopediatría: <FaChild size={38} color="#49b6b2" />,
    'Cirugía Oral': <FaUserMd size={38} color="#49b6b2" />,
    'Rehabilitación Oral': <FaRegGrinBeam size={38} color="#49b6b2" />,
  };

  return (
    <>
      <NavBar />
      <div className="container py-4">
        <h2 className="mb-4 text-center">Servicios Disponibles</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Row>
          {servicios.length === 0 && <Col className="text-center">No hay servicios activos.</Col>}
          {servicios.map(servicio => (
            <Col md={4} sm={6} xs={12} key={servicio._id} className="mb-4 d-flex align-items-stretch">
              <Card style={{ minHeight: 220, borderRadius: 18, boxShadow: '0 2px 12px rgba(73,182,178,0.08)', width: '100%' }} className="w-100">
                <Card.Body className="d-flex flex-column align-items-center justify-content-between">
                  <div className="mb-2">{iconosServicios[servicio.Nombre] || <FaTooth size={38} color="#49b6b2" />}</div>
                  <Card.Title style={{ fontWeight: 700, color: '#556f70', fontSize: 22, textAlign: 'center' }}>{servicio.Nombre}</Card.Title>
                  <Card.Text style={{ color: '#7d7e7d', fontSize: 15, textAlign: 'center', minHeight: 40 }}>{servicio.Descripcion}</Card.Text>
                  <Button variant="primary" style={{ background: '#49b6b2', border: 'none', borderRadius: 16, fontWeight: 600, marginTop: 10 }} onClick={() => handleAgendar(servicio)}>
                    Agendar cita
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        {servicioSeleccionado && (
          <ModalAgendarCitaPaciente
            show={showModal}
            onHide={() => setShowModal(false)}
            servicio={servicioSeleccionado}
            user={user}
            doctoras={doctoras}
            consultorios={consultorios}
            onCitaAgendada={handleCitaAgendada}
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default AgendarCitas;
