import React, { useEffect, useState, useContext } from 'react';
import api from '../API/axiosInstance';
import { Table, Spinner, Alert, InputGroup, Form, Container, Button, Modal } from 'react-bootstrap';
import { FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import NavBarCrud from './NavBar/NavBarCrud';
import ModalDoctor from './Modales/ModalDoctor';
import { AuthContext } from '../contexts/AuthContext';

const API_URL = '/doctora';
const API_PERMISOS = '/permisos';
const API_CONSULTORIOS = '/consultorios';
const API_CARGOS = '/cargo';

const colorScheme = {
  primary: '#2c3e50',
  light: '#ecf0f1',
  dark: '#2c3e50',
  secondary: '#bdc3c7'
};

const TablaDoctores = () => {
  const { user } = useContext(AuthContext);
  const userRol = typeof user.Permiso === "string" ? user.Permiso : user.Permiso?.rol || "";

  const [doctores, setDoctores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('crear');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [permisos, setPermisos] = useState([]);
  const [consultorios, setConsultorios] = useState([]);
  const [modalError, setModalError] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [cargos, setCargos] = useState([]);

  useEffect(() => {
    fetchDoctores();
    fetchPermisos();
    fetchConsultorios();
    fetchCargos();
  }, []);

  const puedeVer = userRol === "ADMIN" || userRol === "DOCTORA";
  const puedeCrear = userRol === "ADMIN";
  const puedeEditar = userRol === "ADMIN";
  const puedeEliminar = userRol === "ADMIN";

  if (!puedeVer) return <div>No tienes permisos para ver esta tabla.</div>;

  const fetchDoctores = async () => {
    setLoading(true);
    try {
      const response = await api.get(API_URL);
      setDoctores(response.data);
      setError(null);
    } catch {
      setError('Error al cargar los doctores');
    } finally {
      setLoading(false);
    }
  };

  const fetchPermisos = async () => {
    try {
      const response = await api.get(API_PERMISOS);
      setPermisos(response.data);
    } catch {
      setPermisos([]);
    }
  };

  const fetchConsultorios = async () => {
    try {
      const response = await api.get(API_CONSULTORIOS);
      setConsultorios(response.data);
    } catch {
      setConsultorios([]);
    }
  };

  const fetchCargos = async () => {
    try {
      const response = await api.get(API_CARGOS);
      setCargos(response.data);
    } catch {
      setCargos([]);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredDoctores = doctores.filter((doctor) =>
    doctor.Doc_identificacion?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.Nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.Apellidos?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredDoctores.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredDoctores.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Modal handlers
  const openCreateModal = () => {
    setSelectedDoctor(null);
    setModalMode('crear');
    setModalError(null);
    setShowModal(true);
  };

  const openEditModal = (doctor) => {
    setSelectedDoctor(doctor);
    setModalMode('editar');
    setModalError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDoctor(null);
    setModalError(null);
    setModalLoading(false);
  };

  const handleModalSubmit = async (formData) => {
    setModalLoading(true);
    try {
      if (modalMode === 'crear') {
        await api.post(API_URL, formData);
      } else if (modalMode === 'editar' && selectedDoctor) {
        const dataToSend = { ...formData };
        delete dataToSend.Clave; // No enviar clave al editar
        await api.patch(`${API_URL}/${selectedDoctor._id}`, dataToSend);
      }
      closeModal();
      fetchDoctores();
    } catch {
      setModalError('Error al guardar el doctor');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteClick = (doctor) => {
    setDoctorToDelete(doctor);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (!doctorToDelete) return;
    setModalLoading(true);
    try {
      await api.delete(`${API_URL}/${doctorToDelete._id}`);
      setShowConfirmDelete(false);
      setDoctorToDelete(null);
      fetchDoctores();
    } catch {
      setModalError('Error al eliminar el doctor');
    } finally {
      setModalLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
    setDoctorToDelete(null);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colorScheme.light, display: 'flex' }}>
      {/* Sidebar */}
      <NavBarCrud colorScheme={colorScheme} userRol={userRol} />

      {/* Contenido principal */}
      <div style={{ flex: 1, padding: '40px 24px 24px 24px', maxWidth: '100vw' }}>
        <Container fluid className="py-2 px-0">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 style={{ color: colorScheme.dark, fontWeight: 700, marginBottom: 0 }}>Gestión de Doctores</h1>
            {puedeCrear && (
              <Button variant="primary" onClick={openCreateModal}>
                <FaPlus className="me-2" /> Crear Doctor
              </Button>
            )}
          </div>
          {error && (
            <Alert
              variant="danger"
              dismissible
              onClose={() => setError(null)}
              style={{ backgroundColor: "#e74c3c", color: 'white' }}
            >
              {error}
            </Alert>
          )}

          {/* Search Bar */}
          <InputGroup className="mb-4 shadow-sm" style={{ maxWidth: 500 }}>
            <InputGroup.Text style={{
              backgroundColor: "#3498db",
              color: 'white',
              border: 'none'
            }}>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Buscar por nombre, apellido o documento"
              value={searchTerm}
              onChange={handleSearch}
              style={{ borderLeft: 'none' }}
            />
          </InputGroup>

          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" style={{ color: "#3498db" }} />
              <p className="mt-2" style={{ color: colorScheme.dark }}>Cargando doctores...</p>
            </div>
          ) : (
            <div className="table-responsive shadow-sm rounded" style={{ background: "#fff", padding: 16 }}>
              <Table responsive striped hover className="mb-0 align-middle">
                <thead style={{ backgroundColor: colorScheme.primary, color: colorScheme.light }}>
                  <tr>
                    <th>Nombres</th>
                    <th>Apellidos</th>
                    <th>Tipo_Doc</th>
                    <th>Doc_identificacion</th>
                    <th>Correo</th>
                    <th>Permiso</th>
                    <th>Consultorio</th>
                    <th>Cargo</th>
                    {puedeEditar || puedeEliminar ? <th>Acciones</th> : null}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map(doctor => (
                    <tr key={doctor._id}>
                      <td>{doctor.Nombres}</td>
                      <td>{doctor.Apellidos}</td>
                      <td>{doctor.Tipo_Doc}</td>
                      <td>{doctor.Doc_identificacion}</td>
                      <td>{doctor.Correo}</td>
                      <td>{doctor.Permiso?.rol || 'Sin rol'}</td>
                      <td>{doctor.Id_consultorio?.Nombre_consultorio || 'Sin asignar'}</td>
                      <td>{doctor.cargo?.nombre || 'Sin cargo'}</td>
                      {(puedeEditar || puedeEliminar) && (
                        <td>
                          {puedeEditar && (
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-2"
                              onClick={() => openEditModal(doctor)}
                            >
                              <FaEdit />
                            </Button>
                          )}
                          {puedeEliminar && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteClick(doctor)}
                            >
                              <FaTrash />
                            </Button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </Table>
              <nav>
                <ul className="pagination">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => paginate(i + 1)}>{i + 1}</button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
          <Modal show={showConfirmDelete} onHide={handleCancelDelete} centered>
            <Modal.Header closeButton>
              <Modal.Title>Confirmar Eliminación</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              ¿Estás seguro de que deseas eliminar al doctor <strong>{doctorToDelete?.Nombres}</strong>?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCancelDelete} disabled={modalLoading}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={handleConfirmDelete} disabled={modalLoading}>
                Eliminar
              </Button>
            </Modal.Footer>
          </Modal>
          <ModalDoctor
            show={showModal}
            onHide={closeModal}
            onSubmit={handleModalSubmit}
            mode={modalMode}
            doctor={selectedDoctor}
            permisos={permisos}
            consultorios={consultorios}
            cargos={cargos}
            loading={modalLoading}
            error={modalError}
          />
        </Container>
      </div>
    </div>
  );
};

export default TablaDoctores;
