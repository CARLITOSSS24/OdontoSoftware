import React, { useEffect, useState, useContext } from 'react';
import api from '../API/axiosInstance';
import { Card, Row, Col, Alert, Button } from 'react-bootstrap';
import { AuthContext } from '../contexts/AuthContext';
import NavBar from '../components/NavBar/NavBar';
import Footer from '../components/Footer';
import { FaTeeth, FaTooth, FaUserMd, FaXRay, FaSmile, FaClinicMedical, FaChild, FaRegGrinStars, FaRegGrinBeam, FaRegGrinBeamSweat, FaRegGrinAlt, FaRegGrin, FaRegGrinTongue, FaRegGrinHearts, FaCalendarCheck } from 'react-icons/fa';

const MisCitas = () => {
  const [citas, setCitas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    obtenerDocumentoYFiltrarCitas();
    fetchServicios();
  }, []);

  const obtenerDocumentoYFiltrarCitas = async () => {
    let docUser = user?.Doc_identificacion || user?.doc_identificacion || user?.documento || user?.documentoCliente || '';
    // Si no está en el contexto, obtenerlo desde la API
    if (!docUser && (user?._id || user?.id)) {
      try {
        const res = await api.get(`/users/${user._id || user.id}`);
        docUser = res.data.Doc_identificacion || '';
      } catch {
        setError('No se pudo obtener el documento del usuario.');
        return;
      }
    }
    fetchCitas(docUser);
  };

  const fetchCitas = async (docUser) => {
    try {
      const response = await api.get('/citas');
      // Depuración: mostrar los valores
      console.log('USER:', user);
      console.log('CITAS:', response.data.data || response.data || []);
      // Filtrar solo las citas del paciente actual (comparar como string)
      const misCitas = (response.data.data || response.data || []).filter(cita => {
        return String(cita.documentoCliente) === String(docUser);
      });
      setCitas(misCitas.slice(0, 3));
    } catch (err) {
      setError('Error al cargar tus citas');
    }
  };

  const fetchServicios = async () => {
    try {
      const response = await api.get('/servicio');
      setServicios(response.data);
    } catch (err) {
      // No crítico
    }
  };

  const getServicioNombre = (id) => {
    const s = servicios.find(serv => serv._id === (id?._id || id));
    return s ? s.Nombre : 'Sin asignar';
  };

  const iconosServicios = {
    Ortodoncia: <FaTeeth size={32} color="#49b6b2" />,
    'Limpieza Dental': <FaTooth size={32} color="#49b6b2" />,
    'Consulta Odontológica General': <FaClinicMedical size={32} color="#49b6b2" />,
    'Limpieza Dental Profilaxis': <FaTooth size={32} color="#49b6b2" />,
    'Radiografías Dentales': <FaXRay size={32} color="#49b6b2" />,
    'Resinas o Restauraciones Estéticas': <FaSmile size={32} color="#49b6b2" />,
    'Extracciones Dentales': <FaRegGrinBeamSweat size={32} color="#49b6b2" />,
    Endodoncia: <FaRegGrinStars size={32} color="#49b6b2" />,
    'Blanqueamiento Dental': <FaRegGrinHearts size={32} color="#49b6b2" />,
    'Prótesis Dentales': <FaRegGrinAlt size={32} color="#49b6b2" />,
    'Implantes Dentales': <FaRegGrin size={32} color="#49b6b2" />,
    Periodoncia: <FaRegGrinTongue size={32} color="#49b6b2" />,
    Odontopediatría: <FaChild size={32} color="#49b6b2" />,
    'Cirugía Oral': <FaUserMd size={32} color="#49b6b2" />,
    'Rehabilitación Oral': <FaRegGrinBeam size={32} color="#49b6b2" />,
  };

  return (
    <>
      <NavBar />
      <div className="container py-4">
        <h2 className="mb-4 text-center">Mis Citas</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Row>
          {citas.length === 0 && (
            <Col className="text-center">
              <div style={{ padding: 32 }}>
                <FaCalendarCheck size={48} color="#49b6b2" style={{ marginBottom: 12 }} />
                <h4>Ups, no tienes citas, ¿necesitas algún servicio dental?</h4>
                <Button variant="primary" style={{ background: '#49b6b2', border: 'none', borderRadius: 16, fontWeight: 600, marginTop: 16 }} href="/agendar-cita">
                  Agendar cita
                </Button>
              </div>
            </Col>
          )}
          {citas.map(cita => (
            <Col md={4} sm={6} xs={12} key={cita._id} className="mb-4 d-flex align-items-stretch">
              <Card style={{ borderRadius: 18, boxShadow: '0 2px 12px rgba(73,182,178,0.08)', width: '100%' }} className="w-100">
                <Card.Body className="d-flex flex-column align-items-center justify-content-between">
                  <div className="mb-2">{iconosServicios[getServicioNombre(cita.servicios)] || <FaTooth size={32} color="#49b6b2" />}</div>
                  <Card.Title style={{ fontWeight: 700, color: '#556f70', fontSize: 20, textAlign: 'center' }}>{getServicioNombre(cita.servicios)}</Card.Title>
                  <Card.Text style={{ color: '#7d7e7d', fontSize: 15, textAlign: 'center', minHeight: 40 }}>
                    <strong>Fecha:</strong> {cita.fecha ? cita.fecha.split('T')[0] : 'N/A'}<br />
                    <strong>Hora:</strong> {cita.hora || 'N/A'}<br />
                    <strong>Estado:</strong> <span style={{ color: cita.estado === 'Terminado' ? '#49b6b2' : '#7d7e7d', fontWeight: 600 }}>{cita.estado || 'Pendiente'}</span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        {citas.length >= 3 && (
          <Alert variant="info" className="mt-3 text-center">
            Solo puedes tener hasta 3 citas agendadas.
          </Alert>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MisCitas; 