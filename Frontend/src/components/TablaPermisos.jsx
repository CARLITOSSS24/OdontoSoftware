import React, { useState, useEffect, useContext } from 'react';
import api from '../API/axiosInstance';
import { Link, useLocation } from 'react-router-dom';
import {
    FaUserCog,
    FaKey,
    FaEdit,
    FaTrash,
    FaTimes,
    FaCogs,
    FaCalendarAlt,
    FaFileMedical,
    FaClinicMedical,
    FaUserMd
} from 'react-icons/fa';
import { Button, Nav, Table, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from '../contexts/AuthContext';
import { tienePermiso } from '../utils/roles'; // Importa la función de permisos
import NavBarCrud from './NavBar/NavBarCrud';
import { ModalEditarPermiso, ModalEliminarPermiso } from './Modales/ModalPermiso';
import '../styles/globalTableStyles.css';

const API_URL = '/permisos';

const TablaPermisos = () => {
    // Contexto de autenticación y ubicación
    const { user } = useContext(AuthContext);
    const location = useLocation();

    // Determina el rol mínimo requerido según la ruta
    let rutaRol = "";
    if (location.pathname.startsWith('/admin')) rutaRol = "ADMIN";
    else if (location.pathname.startsWith('/doctora')) rutaRol = "DOCTORA";
    else if (location.pathname.startsWith('/recepcionista')) rutaRol = "RECEPCIONISTA";

    // Obtiene el rol real del usuario
    const userRol = typeof user.Permiso === "string" ? user.Permiso : user.Permiso?.rol || "";

    // Permisos por jerarquía
    const puedeVer = tienePermiso(userRol, rutaRol);
    const puedeCrear = tienePermiso(userRol, rutaRol);
    const puedeEditar = tienePermiso(userRol, rutaRol);
    const puedeBorrar = userRol === "ADMIN"; // Solo ADMIN puede borrar permisos

    // Si no puede ver, no renderiza nada
    if (!puedeVer) return <div>No tienes permisos para ver esta tabla.</div>;

    // Estados principales
    const [permisos, setPermisos] = useState([]);
    const [editingPermiso, setEditingPermiso] = useState(null);
    const [formData, setFormData] = useState({ rol: '' });
    const [formErrors, setFormErrors] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [permisoToDelete, setPermisoToDelete] = useState(null);

    const colorScheme = {
        primary: '#2c3e50',
        secondary: '#34495e',
        accent: '#3498db',
        light: '#ecf0f1',
        dark: '#2c3e50',
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) setSidebarOpen(false);
        };

        window.addEventListener('resize', handleResize);
        fetchPermisos();
        return () => window.removeEventListener('resize', handleResize);
        // eslint-disable-next-line
    }, [location.pathname]);

    const fetchPermisos = async () => {
        setLoading(true);
        try {
            const response = await api.get(API_URL);
            setPermisos(response.data);
            setError(null);
        } catch (error) {
            setError('Error al cargar los permisos');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (formErrors[name]) {
            setFormErrors({ ...formErrors, [name]: null });
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.rol.trim()) errors.rol = 'El rol es requerido';
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            if (editingPermiso) {
                await api.patch(`${API_URL}/${editingPermiso._id}`, formData);
            } else {
                await api.post(API_URL, formData);
            }
            setShowEditModal(false);
            fetchPermisos();
        } catch (error) {
            setError('Error al guardar el permiso');
        }
    };

    const handleEdit = (permiso) => {
        setEditingPermiso(permiso);
        setFormData({ rol: permiso.rol || '' });
        setShowEditModal(true);
    };

    const handleDeleteClick = (permiso) => {
        setPermisoToDelete(permiso);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`${API_URL}/${permisoToDelete._id}`);
            setShowDeleteModal(false);
            fetchPermisos();
        } catch (error) {
            setError('Error al eliminar el permiso');
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredPermisos = permisos.filter((permiso) =>
        permiso.rol?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = filteredPermisos.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredPermisos.length / itemsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Configuración de vistas permitidas por rol
    const menuConfig = {
        ADMIN: [
            { key: 'usuarios', label: 'Usuarios', icon: <FaUserCog className="me-2" /> },
            { key: 'permisos', label: 'Permisos', icon: <FaKey className="me-2" /> },
            { key: 'servicios', label: 'Servicios', icon: <FaCogs className="me-2" /> },
            { key: 'citas', label: 'Citas', icon: <FaCalendarAlt className="me-2" /> },
            { key: 'historiales', label: 'Historiales', icon: <FaFileMedical className="me-2" /> },
            { key: 'consultorios', label: 'Consultorios', icon: <FaClinicMedical className="me-2" /> },
            { key: 'doctores', label: 'Doctores', icon: <FaUserMd className="me-2" /> },
        ],
        DOCTORA: [
            { key: 'usuarios', label: 'Usuarios', icon: <FaUserCog className="me-2" /> },
            { key: 'permisos', label: 'Permisos', icon: <FaKey className="me-2" /> },
            { key: 'servicios', label: 'Servicios', icon: <FaCogs className="me-2" /> },
            { key: 'historiales', label: 'Historiales', icon: <FaFileMedical className="me-2" /> },
            { key: 'consultorios', label: 'Consultorios', icon: <FaClinicMedical className="me-2" /> },
            { key: 'doctores', label: 'Doctores', icon: <FaUserMd className="me-2" /> },
        ],
        RECEPCIONISTA: [
            { key: 'usuarios', label: 'Usuarios', icon: <FaUserCog className="me-2" /> },
            { key: 'historiales', label: 'Historiales', icon: <FaFileMedical className="me-2" /> },
            { key: 'consultorios', label: 'Consultorios', icon: <FaClinicMedical className="me-2" /> },
        ],
    };

    // Función para obtener el prefijo de ruta según el rol
    const getBasePath = (rol) => {
        if (rol === "ADMIN") return "/admin";
        if (rol === "DOCTORA") return "/doctora";
        if (rol === "RECEPCIONISTA") return "/recepcionista";
        return "/";
    };

    const basePath = getBasePath(userRol);

    // Genera el menú filtrado según el rol
    const menuItems = (menuConfig[userRol] || []).map(item => ({
        ...item,
        path: `${basePath}/${item.key}`
    }));

    if (loading) return <div>Cargando permisos...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: colorScheme.light }}>
            {/* Sidebar NavBarCrud */}
            <NavBarCrud colorScheme={colorScheme} userRol={userRol} />
            {/* Main Content */}
            <div className="flex-grow-1 p-4">
                <h1 className="text-center mb-4">Gestión de Permisos</h1>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <input
                        type="text"
                        className="form-control w-50"
                        placeholder="Buscar por Rol"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    {puedeCrear && (
                        <Button
                            variant="success"
                            onClick={() => {
                                setEditingPermiso(null);
                                setFormData({ rol: '' });
                                setShowEditModal(true);
                            }}
                        >
                            Crear Nuevo Permiso
                        </Button>
                    )}
                </div>
                <div className="table-responsive shadow-sm rounded">
                    <Table responsive striped hover className="mb-0">
                        <thead style={{ backgroundColor: colorScheme.primary, color: colorScheme.light }}>
                            <tr>
                                <th>Rol</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((permiso) => (
                                <tr key={permiso._id}>
                                    <td>{permiso.rol || 'N/A'}</td>
                                    <td>
                                        {puedeEditar && (
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleEdit(permiso)}
                                            >
                                                <FaEdit />
                                            </Button>
                                        )}
                                        {puedeBorrar && (
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDeleteClick(permiso)}
                                            >
                                                <FaTrash />
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
                <nav>
                    <ul className="pagination">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => paginate(i + 1)}>{i + 1}</button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Modal de edición */}
                <ModalEditarPermiso
                  show={showEditModal}
                  onHide={() => setShowEditModal(false)}
                  onSubmit={handleSubmit}
                  formData={formData}
                  formErrors={formErrors}
                  handleInputChange={handleInputChange}
                  editingPermiso={editingPermiso}
                />

                {/* Modal de eliminación */}
                <ModalEliminarPermiso
                  show={showDeleteModal}
                  onHide={() => setShowDeleteModal(false)}
                  onConfirm={confirmDelete}
                  permisoToDelete={permisoToDelete}
                />
            </div>
        </div>
    );
};

export default TablaPermisos;