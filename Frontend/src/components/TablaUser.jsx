import React, { useState, useEffect, useContext } from 'react';
import api from '../API/axiosInstance';
import { Table, Spinner, Alert, InputGroup, Form, Container, Button } from 'react-bootstrap';
import { FaSearch, FaUser, FaCalendarAlt, FaClinicMedical, FaEdit, FaTrash, FaPlus, FaUserMd, FaHistory, FaKey, FaConciergeBell } from 'react-icons/fa';
import { AuthContext } from '../contexts/AuthContext';
import { tienePermiso } from '../utils/roles';
import NavBarCrud from './NavBar/NavBarCrud';
// Importa los modales ya hechos
import { ModalEditarUsuario, ModalCrearUsuario, ModalEliminarUsuario } from './Modales/ModalUser';
import '../styles/globalTableStyles.css';

const API_URL = '/users';

const colorScheme = {
  primary: '#2c3e50',
  light: '#ecf0f1',
  dark: '#2c3e50',
  secondary: '#bdc3c7'
};

const TablaUser = () => {
  // Contexto de autenticación
  const { user } = useContext(AuthContext);
  let userRol = typeof user.Permiso === "string" ? user.Permiso : user.Permiso?.rol || "";
  // Forzar a mayúsculas y quitar espacios
  userRol = (userRol || '').toUpperCase().trim();
  // Log para depuración
  console.log('userRol:', userRol, 'user:', user);

  // Permisos
  const puedeVer = tienePermiso(userRol, "ADMIN") || tienePermiso(userRol, "DOCTORA") || tienePermiso(userRol, "RECEPCIONISTA");
  const puedeCrear = tienePermiso(userRol, "ADMIN") || tienePermiso(userRol, "DOCTORA") || tienePermiso(userRol, "RECEPCIONISTA");
  const puedeEditar = tienePermiso(userRol, "ADMIN") || tienePermiso(userRol, "DOCTORA") || tienePermiso(userRol, "RECEPCIONISTA");
  const puedeEliminar = tienePermiso(userRol, "ADMIN") || tienePermiso(userRol, "DOCTORA");  

  if (!puedeVer) return <div>No tienes permisos para ver esta tabla.</div>;

  // Estados principales
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para modales
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [userToDelete, setUserToDelete] = useState(null);
  const [permisos, setPermisos] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = users.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchUsers();
    fetchPermisos();
    // eslint-disable-next-line
  }, []);

  const fetchPermisos = async () => {
    try {
      const response = await api.get('/permisos');
      if (response.data) {
        setPermisos(response.data);
      }
    } catch (error) {
      console.error('Error al cargar permisos:', error);
      // No establecemos error global ya que no es crítico
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(API_URL);
      if (response.data) {
        setUsers(response.data);
      } else {
        setError('No se recibieron datos del servidor');
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setError(error.response?.data?.message || 'Error al cargar los usuarios. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.Doc_identificacion?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.Nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.Apellido?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers para modales
  const handleOpenEdit = (user) => {
    setFormData({
      ...user,
      Clave: '',
      Permiso: user.Permiso?._id || user.Permiso // Asegura que Permiso sea el _id
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleOpenCreate = () => {
    setFormData({
      Nombre: '',
      Apellido: '',
      Tipo_Doc: '',
      Doc_identificacion: '',
      Telefono: '',
      Correo: '',
      Edad: '',
      Genero: '',
      Permiso: '',
      Clave: ''
    });
    setFormErrors({});
    setShowCreateModal(true);
  };

  const handleOpenDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Simulación de validación y envío (ajusta según tu lógica real)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    // Solo los campos válidos
    const {
      Nombre,
      Apellido,
      Tipo_Doc,
      Doc_identificacion,
      Telefono,
      Correo,
      Clave,
      Permiso,
      Genero,
      Edad
    } = formData;

    const dataToSend = {
      Nombre,
      Apellido,
      Tipo_Doc,
      Doc_identificacion,
      Telefono: Number(Telefono),
      Correo,
      Permiso,
      Genero,
      Edad: Number(Edad)
    };

    // Solo agrega Clave si existe y no está vacía
    if (Clave) dataToSend.Clave = Clave;

    try {
      await api.patch(`${API_URL}/${formData._id}`, dataToSend);
      setShowEditModal(false);
      fetchUsers();
    } catch (err) {
      setFormErrors({ general: 'Error al actualizar usuario.' });
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    // Convierte los campos a número y usa el _id del permiso
    const dataToSend = {
      ...formData,
      Telefono: Number(formData.Telefono),
      Edad: Number(formData.Edad),
      Permiso: formData.Permiso, // Debe ser el _id, no el nombre
    };
    try {
      await api.post(API_URL, dataToSend);
      setShowCreateModal(false);
      fetchUsers();
    } catch (err) {
      setFormErrors({ general: 'Error al crear usuario.' });
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`${API_URL}/${userToDelete._id}`);
      setShowDeleteModal(false);
      fetchUsers();
    } catch (err) {
      setError('Error al eliminar usuario.');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colorScheme.light, display: 'flex' }}>
      {/* Sidebar */}
      <NavBarCrud colorScheme={colorScheme} userRol={userRol} />

      {/* Contenido principal */}
      <div style={{ flex: 1, padding: '40px 24px 24px 24px', maxWidth: '100vw' }}>
        <Container fluid className="py-2 px-0">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 style={{ color: colorScheme.dark, fontWeight: 700, marginBottom: 0 }}>Gestión de Usuarios</h1>
            {puedeCrear && (
              <Button variant="primary" onClick={handleOpenCreate}>
                <FaPlus className="me-2" /> Crear Usuario
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
              <p className="mt-2" style={{ color: colorScheme.dark }}>Cargando usuarios...</p>
            </div>
          ) : (
            <div className="table-responsive shadow-sm rounded" style={{ background: "#fff", padding: 16 }}>
              <Table responsive striped hover className="mb-0 align-middle">
                <thead style={{ backgroundColor: colorScheme.primary, color: colorScheme.light }}>
                  <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Tipo de Documento</th>
                    <th>Identificación</th>
                    <th>Teléfono</th>
                    <th>Correo</th>
                    <th>Edad</th>
                    <th>Género</th>
                    <th>Permiso</th>
                    {(puedeEditar || puedeEliminar) && <th>Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map(user => (
                    <tr key={user._id}>
                      <td>{user.Nombre}</td>
                      <td>{user.Apellido}</td>
                      <td>{user.Tipo_Doc}</td>
                      <td>{user.Doc_identificacion}</td>
                      <td>{user.Telefono}</td>
                      <td>{user.Correo}</td>
                      <td>{user.Edad}</td>
                      <td>{user.Genero}</td>
                      <td>{user.Permiso?.rol || user.Permiso || 'N/A'}</td>
                      {(puedeEditar || puedeEliminar) && (
                        <td>
                          {puedeEditar && (
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-2"
                              onClick={() => handleOpenEdit(user)}
                            >
                              <FaEdit />
                            </Button>
                          )}
                          {puedeEliminar && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleOpenDelete(user)}
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

          {/* Modales */}
          <ModalEditarUsuario
            show={showEditModal}
            onHide={() => setShowEditModal(false)}
            onSubmit={handleEditSubmit}
            formData={formData}
            formErrors={formErrors}
            handleInputChange={handleInputChange}
            permisos={permisos} // <-- PASA LOS PERMISOS AQUÍ
          />
          <ModalCrearUsuario
            show={showCreateModal}
            onHide={() => setShowCreateModal(false)}
            onSubmit={handleCreateSubmit}
            formData={formData}
            formErrors={formErrors}
            handleInputChange={handleInputChange}
            permisos={permisos} // <-- PASA LOS PERMISOS AQUÍ
          />
          <ModalEliminarUsuario
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteConfirm}
            userToDelete={userToDelete}
          />
        </Container>
      </div>
    </div>
  );
};

export default TablaUser;