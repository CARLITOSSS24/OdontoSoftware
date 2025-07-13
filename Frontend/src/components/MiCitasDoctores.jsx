import React, { useEffect, useState, useContext } from 'react';
import api from '../API/axiosInstance';
import { Card, Row, Col, Alert, Button, Form, Modal } from 'react-bootstrap';
import { AuthContext } from '../contexts/AuthContext';
import { FaCalendarAlt, FaUserMd, FaClock, FaTooth } from 'react-icons/fa';
import NavBarCrud from './NavBar/NavBarCrud';
import { ModalCrearHistorial, ModalVerHistorial } from './Modales/ModalHistorial';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const MiCitasDoctores = () => {
  const [citas, setCitas] = useState([]);
  const [doctoras, setDoctoras] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDoctora, setSelectedDoctora] = useState('');
  const { user } = useContext(AuthContext);
  const [showDetalle, setShowDetalle] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [showHistorial, setShowHistorial] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [historialPaciente, setHistorialPaciente] = useState(null);
  const [loadingHistorial, setLoadingHistorial] = useState(false);
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCitas = citas.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(citas.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const location = useLocation();
  const [reload, setReload] = useState(0);
  const handleReload = () => setReload(r => r + 1);

  useEffect(() => {
    // Siempre recarga datos al entrar a la ruta o cuando reload cambie
    if (location.pathname === '/doctora/mis-citas') {
      fetchDoctoras();
      fetchServicios();
      fetchCitas();
      fetchPacientes();
      setCitaSeleccionada(null);
      setShowDetalle(false);
      setShowHistorial(false);
      setHistorialPaciente(null);
    }
    // Limpieza de estados al desmontar
    return () => {
      setCitaSeleccionada(null);
      setShowDetalle(false);
      setShowHistorial(false);
      setHistorialPaciente(null);
    };
  }, [location.pathname, reload]);

  const fetchDoctoras = async () => {
    try {
      const response = await api.get('/doctora');
      setDoctoras(response.data);
    } catch (err) {
      setError('Error al cargar las doctoras');
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

  const fetchCitas = async () => {
    try {
      const response = await api.get('/citas');
      const citasData = response.data.data || response.data || [];
      
      // Si el usuario es una doctora, filtrar solo sus citas
      if (user.Permiso === 'DOCTORA') {
        const misCitas = citasData.filter(cita => 
          cita.doctora?._id === user.id || cita.doctora === user.id
        );
        setCitas(misCitas);
      } else {
        setCitas(citasData);
      }
      setError(null);
    } catch (err) {
      setError('Error al cargar las citas');
      console.error('Error fetching citas:', err);
    }
  };

  const fetchPacientes = async () => {
    try {
      const response = await api.get('/users');
      setPacientes(response.data);
    } catch (err) {
      // No crítico
    }
  };

  const getServicioNombre = (id) => {
    const servicio = servicios.find(s => s._id === (id?._id || id));
    return servicio ? servicio.Nombre : 'Sin asignar';
  };

  const getDoctoraNombre = (id) => {
    const doctora = doctoras.find(d => d._id === (id?._id || id));
    return doctora ? `${doctora.Nombres} ${doctora.Apellidos}` : 'Sin asignar';
  };

  // Filtrado: si el usuario es DOCTORA, solo ve sus citas
  const isDoctora = user.Permiso === 'DOCTORA';
  const citasFiltradas = isDoctora
    ? citas
    : (selectedDoctora
      ? citas.filter(cita => cita.doctora?._id === selectedDoctora || cita.doctora === selectedDoctora)
      : citas);

  // Ordenar citas por fecha y hora
  const citasOrdenadas = [...citasFiltradas].sort((a, b) => {
    const fechaA = new Date(a.fecha);
    const fechaB = new Date(b.fecha);
    if (fechaA.getTime() === fechaB.getTime()) {
      return a.hora.localeCompare(b.hora);
    }
    return fechaA.getTime() - fechaB.getTime();
  });

  // Obtener el rol del usuario
  const userRol = typeof user?.Permiso === "string" ? user.Permiso : user?.Permiso?.rol || user?.Permiso?.Rol || "";

  // Confirmar asistencia
  const confirmarAsistencia = async (citaId) => {
    try {
      const res = await api.patch(`/citas/${citaId}/confirmar`);
      setSuccessMsg(res.data.message || 'Asistencia confirmada');
      fetchCitas();
      setTimeout(() => setSuccessMsg(null), 2000);
    } catch (error) {
      setErrorMsg('Error al confirmar la asistencia');
      setTimeout(() => setErrorMsg(null), 2000);
    }
  };

  // Obtener datos del paciente para historial
  const getPacienteId = (cita) => {
    const paciente = pacientes.find(p =>
      p.Nombre === cita.nombreCliente && p.Apellido === cita.apellidoCliente && p.Doc_identificacion === cita.documentoCliente
    );
    return paciente?._id || '';
  };

  // Obtener datos completos del paciente para una cita
  const getPacienteCompleto = (cita) => {
    return pacientes.find(p =>
      p.Nombre === cita.nombreCliente &&
      p.Apellido === cita.apellidoCliente &&
      p.Doc_identificacion === cita.documentoCliente
    );
  };

  // Modal de detalles de cita
  const DetalleCitaModal = ({ show, onHide, cita }) => {
    const [cargarDatos, setCargarDatos] = useState(true);
    const handleIrAlHistorial = async () => {
      setLoadingHistorial(true);
      setShowHistorial(true);
      setHistorialPaciente(null);
      try {
        const pacienteId = getPacienteId(cita);
        if (pacienteId) {
          const res = await api.get(`/historiales/paciente/${pacienteId}`);
          setHistorialPaciente(res.data);
        } else {
          setHistorialPaciente(null);
        }
      } catch (err) {
        setHistorialPaciente(null); // No existe historial
      } finally {
        setLoadingHistorial(false);
        onHide();
      }
    };
    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la Cita</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {successMsg && <Alert variant="success">{successMsg}</Alert>}
          {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
          <div><strong>Doctor(a):</strong> {getDoctoraNombre(cita.doctora)}</div>
          <div><strong>Servicio:</strong> {getServicioNombre(cita.servicios)}</div>
          <div><strong>Fecha:</strong> {cita.fecha ? cita.fecha.split('T')[0] : 'N/A'}</div>
          <div><strong>Hora:</strong> {cita.hora || 'N/A'}</div>
          {/* Más datos del paciente en el modal */}
          {(() => {
            const paciente = getPacienteCompleto(cita);
            return paciente ? (
              <div style={{ fontSize: 15, color: '#556f70', marginBottom: 8 }}>
                <div><strong>Paciente:</strong> {paciente.Nombre} {paciente.Apellido}</div>
                <div><strong>Documento:</strong> {paciente.Doc_identificacion}</div>
                <div><strong>Correo:</strong> {paciente.Correo || 'N/A'}</div>
                <div><strong>Teléfono:</strong> {paciente.Telefono || 'N/A'}</div>
              </div>
            ) : (
              <div style={{ fontSize: 15, color: '#556f70', marginBottom: 8 }}>
                <div><strong>Paciente:</strong> {cita.nombreCliente} {cita.apellidoCliente}</div>
                <div><strong>Documento:</strong> {cita.documentoCliente}</div>
              </div>
            );
          })()}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => confirmarAsistencia(cita._id)} disabled={cita.estado === 'Terminado'}>
            Confirmar Asistencia
          </Button>
          <Button variant="info" onClick={handleIrAlHistorial} disabled={loadingHistorial}>
            {loadingHistorial ? 'Cargando...' : 'Ir al historial'}
          </Button>
          <Button variant="secondary" onClick={onHide}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  // Modal para crear o ver historial, según si existe
  const HistorialModal = ({ show, onHide, cita }) => {
    const pacienteId = getPacienteId(cita);
    const pacienteCompleto = getPacienteCompleto(cita);
    const [cargarDatos, setCargarDatos] = useState(true);
    if (historialPaciente && historialPaciente._id) {
      // Mostrar historial existente
      return (
        <ModalVerHistorial
          show={show}
          onHide={onHide}
          historial={historialPaciente}
          doctoras={doctoras}
          onControlAgregado={() => { setShowHistorial(false); fetchCitas(); }}
        />
      );
    } else {
      // Crear historial nuevo, con checkbox para cargar datos
      return (
        <ModalCrearHistorial
          show={show}
          onHide={onHide}
          pacientes={pacientes}
          doctoras={doctoras}
          onHistorialCreado={() => { setShowHistorial(false); fetchCitas(); }}
          prefill={cargarDatos && pacienteCompleto ? {
            paciente: pacienteCompleto._id,
            responsable_creacion: cita.doctora?._id || cita.doctora,
            observaciones_generales: '',
            correo: pacienteCompleto.Correo,
            telefono: pacienteCompleto.Telefono
          } : {
            paciente: pacienteId,
            responsable_creacion: cita.doctora?._id || cita.doctora,
            observaciones_generales: ''
          }}
          extraCheckbox={{
            checked: cargarDatos,
            onChange: () => setCargarDatos(v => !v),
            label: 'Cargar datos completos del paciente'
          }}
        />
      );
    }
  };

  // Citas pendientes
  const citasPendientes = citasOrdenadas.filter(cita => cita.estado !== 'Terminado');

  // Cuando se cierra el modal de detalles o historial, limpiar el estado y recargar
  const handleCloseDetalle = () => {
    setShowDetalle(false);
    setCitaSeleccionada(null);
    handleReload();
  };
  const handleCloseHistorial = () => {
    setShowHistorial(false);
    setCitaSeleccionada(null);
    setHistorialPaciente(null);
    handleReload();
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <NavBarCrud userRol={userRol} />
      <div style={{ flex: 1, padding: '20px', marginLeft: '250px' }}>
        <div className="container py-4">
          <h2 className="mb-4 text-center">Agenda de Citas por Doctor(a)</h2>
          {/* Cards de citas en filas de 3, con paginador cada 9 */}
          <Row>
            {currentCitas.length === 0 ? (
              <Col className="text-center">
                <Alert variant="info">No hay citas disponibles</Alert>
              </Col>
            ) : (
              currentCitas.map(cita => (
                <Col md={4} sm={6} xs={12} key={cita._id} className="mb-4">
                  <Card style={{ 
                    borderRadius: 15, 
                    boxShadow: '0 2px 12px rgba(73,182,178,0.08)',
                    border: 'none',
                    background: '#f8fcfc',
                  }}>
                    <Card.Body>
                      <div className="d-flex align-items-center mb-3">
                        <FaUserMd size={24} color="#49b6b2" className="me-2" />
                        <Card.Title className="mb-0" style={{ color: '#556f70' }}>
                          {getDoctoraNombre(cita.doctora)}
                        </Card.Title>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <FaTooth size={20} color="#49b6b2" className="me-2" />
                        <span style={{ color: '#7d7e7d' }}>
                          {getServicioNombre(cita.servicios)}
                        </span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <FaCalendarAlt size={20} color="#49b6b2" className="me-2" />
                        <span style={{ color: '#7d7e7d' }}>
                          {cita.fecha ? cita.fecha.split('T')[0] : 'N/A'}
                        </span>
                      </div>
                      <div className="d-flex align-items-center mb-3">
                        <FaClock size={20} color="#49b6b2" className="me-2" />
                        <span style={{ color: '#7d7e7d' }}>
                          {cita.hora || 'N/A'}
                        </span>
                      </div>
                      {/* Más datos del paciente */}
                      {(() => {
                        const paciente = getPacienteCompleto(cita);
                        return paciente ? (
                          <div style={{ fontSize: 14, color: '#556f70', marginBottom: 8 }}>
                            <div><strong>Paciente:</strong> {paciente.Nombre} {paciente.Apellido}</div>
                            <div><strong>Documento:</strong> {paciente.Doc_identificacion}</div>
                            <div><strong>Correo:</strong> {paciente.Correo || 'N/A'}</div>
                            <div><strong>Teléfono:</strong> {paciente.Telefono || 'N/A'}</div>
                          </div>
                        ) : (
                          <div style={{ fontSize: 14, color: '#556f70', marginBottom: 8 }}>
                            <div><strong>Paciente:</strong> {cita.nombreCliente} {cita.apellidoCliente}</div>
                            <div><strong>Documento:</strong> {cita.documentoCliente}</div>
                          </div>
                        );
                      })()}
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                        <Button
                          variant="primary"
                          className="mt-3 w-100"
                          style={{ borderRadius: 20, fontWeight: 600, letterSpacing: 1 }}
                          onClick={() => { setCitaSeleccionada(cita); setShowDetalle(true); }}
                        >
                          Más detalles
                        </Button>
                      </motion.div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
          {/* Paginador */}
          {totalPages > 1 && (
            <nav className="d-flex justify-content-center mt-4">
              <ul className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => paginate(i + 1)}>{i + 1}</button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          {/* Botón de recarga manual */}
          <div className="d-flex justify-content-center mt-2">
            <button className="btn btn-outline-info" onClick={handleReload}>Recargar citas</button>
          </div>
          {/* Modales */}
          {showDetalle && citaSeleccionada && (
            <DetalleCitaModal
              show={showDetalle}
              onHide={handleCloseDetalle}
              cita={citaSeleccionada}
            />
          )}
          {showHistorial && citaSeleccionada && (
            <HistorialModal
              show={showHistorial}
              onHide={handleCloseHistorial}
              cita={citaSeleccionada}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MiCitasDoctores; 