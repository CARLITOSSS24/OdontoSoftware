import React, { useState, useEffect, useContext } from 'react';
import api from '../API/axiosInstance'; // Usa la instancia de Axios personalizada
import { Link, useLocation } from 'react-router-dom';
import { FaUserCog, FaKey, FaEdit, FaTrash, FaCogs, FaCalendarAlt, FaFileMedical, FaClinicMedical, FaUserMd, FaTimes, FaCheckCircle, FaFileExcel } from 'react-icons/fa';
import { Button, Table, Modal, Form, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from '../contexts/AuthContext';
import { tienePermiso } from '../utils/roles'; // <-- Importa la función de permisos
import NavBarCrud from './NavBar/NavBarCrud';
import { ModalEditarCita, ModalEliminarCita } from './Modales/ModalCita';
import '../styles/globalTableStyles.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const API_URL = '/citas'; // Ya no necesitas el host, la instancia lo tiene

const TablaCitas = () => {
    // Agrega el contexto de autenticación y ubicación
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
    // Solo ADMIN y DOCTORA pueden crear, editar o borrar
    const puedeCrear = userRol === "ADMIN" || userRol === "DOCTORA";
    const puedeEditar = userRol === "ADMIN" || userRol === "DOCTORA";
    const puedeBorrar = userRol === "ADMIN";

    // Si no puede ver, no renderiza nada
    if (!puedeVer) return <div>No tienes permisos para ver esta tabla.</div>;

    // Estados principales
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const [citas, setCitas] = useState([]);
    const [editingCita, setEditingCita] = useState(null);
    const [formData, setFormData] = useState({
        documentoCliente: '',
        nombreCliente: '',
        apellidoCliente: '',
        servicios: '',
        doctora: '',
        consultorio: '',
        fecha: '',
        hora: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [citaToDelete, setCitaToDelete] = useState(null);

    const [servicios, setServicios] = useState([]);
    const [doctoras, setDoctoras] = useState([]);
    const [consultorios, setConsultorios] = useState([]);

    const colorScheme = {
        primary: '#2c3e50',
        secondary: '#34495e',
        accent: '#3498db',
        light: '#ecf0f1',
        dark: '#2c3e50',
    };

    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) setSidebarOpen(false);
        };

        window.addEventListener('resize', handleResize);
        fetchCitas();
        fetchServicios();
        fetchDoctoras();
        fetchConsultorios();
        return () => window.removeEventListener('resize', handleResize);
    }, [location.pathname]);

    const fetchCitas = async () => {
        setLoading(true);
        try {
            const response = await api.get(API_URL);
            let citasData = response.data.data || response.data || [];
            
            // Si el usuario es una doctora, filtrar solo sus citas
            if (userRol === 'DOCTORA') {
                citasData = citasData.filter(cita => 
                    cita.doctora?._id === user._id || cita.doctora === user._id
                );
            }
            
            setCitas(citasData);
            setError(null);
        } catch (error) {
            setError('Error al cargar las citas');
        } finally {
            setLoading(false);
        }
    };

    const fetchServicios = async () => {
        try {
            const response = await api.get('/servicio');
            setServicios(response.data);
        } catch (error) {
            // No crítico para la vista de citas
        }
    };

    const fetchDoctoras = async () => {
        try {
            const response = await api.get('/doctora');
            setDoctoras(response.data);
        } catch (error) {
            // No crítico para la vista de citas
        }
    };

    const fetchConsultorios = async () => {
        try {
            const response = await api.get('/consultorios');
            setConsultorios(response.data);
        } catch (error) {
            // No crítico para la vista de citas
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEdit = (cita) => {
        setEditingCita(cita);
        setFormData({
            documentoCliente: cita.documentoCliente || '',
            nombreCliente: cita.nombreCliente || '',
            apellidoCliente: cita.apellidoCliente || '',
            servicios: cita.servicios?._id || cita.servicios || '',
            doctora: cita.doctora?._id || cita.doctora || '',
            consultorio: cita.consultorio?._id || cita.consultorio || '',
            fecha: cita.fecha ? cita.fecha.split('T')[0] : '',
            hora: cita.hora || '',
        });
        setShowEditModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            if (editingCita) {
                await api.patch(`${API_URL}/${editingCita._id}`, formData);
            } else {
                await api.post(API_URL, formData);
            }
            setShowEditModal(false);
            fetchCitas();
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al guardar la cita';
            setError(msg);
        }
    };

    const handleDeleteClick = (cita) => {
        setCitaToDelete(cita);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`${API_URL}/${citaToDelete._id}`);
            setShowDeleteModal(false);
            fetchCitas();
        } catch (error) {
            setError('Error al eliminar la cita');
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredCitas = citas.filter((cita) =>
        cita.documentoCliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cita.nombreCliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cita.apellidoCliente?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = filteredCitas.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredCitas.length / itemsPerPage);
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

    const confirmarAsistencia = async (citaId) => {
        try {
            const res = await api.patch(`/citas/${citaId}/confirmar`);
            setSuccessMsg(res.data.message || 'Asistencia confirmada');
            fetchCitas();
            setTimeout(() => setSuccessMsg(''), 4000);
        } catch (error) {
            setError('Error al confirmar la asistencia');
        }
    };

    // Función para exportar a Excel
    const exportarExcel = () => {
        const wsData = [
            ['Documento', 'Nombre', 'Apellido', 'Servicio', 'Doctora', 'Consultorio', 'Fecha', 'Hora'],
            ...currentItems.map(cita => [
                cita.documentoCliente,
                cita.nombreCliente,
                cita.apellidoCliente,
                servicios.find(s => s._id === (cita.servicios?._id || cita.servicios))?.Nombre || 'Sin asignar',
                (() => {
                    const doc = doctoras.find(d => d._id === (cita.doctora?._id || cita.doctora));
                    return doc ? `${doc.Nombres} ${doc.Apellidos}` : 'Sin asignar';
                })(),
                consultorios.find(c => c._id === (cita.consultorio?._id || cita.consultorio))?.Nombre_consultorio || 'Sin asignar',
                cita.fecha ? cita.fecha.split('T')[0] : 'N/A',
                cita.hora || 'N/A',
            ])
        ];
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, 'Citas');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'reporte_citas.xlsx');
    };

    if (loading) return <div>Cargando citas...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: colorScheme.light }}>
            {/* Sidebar NavBarCrud */}
            <NavBarCrud colorScheme={colorScheme} userRol={userRol} />
            {/* Main Content */}
            <div className="flex-grow-1 p-4">
                <h1 className="text-center mb-4">Gestión de Citas</h1>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <input
                        type="text"
                        className="form-control w-50"
                        placeholder="Buscar por Documento, Nombre o Apellido"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <div>
                        <Button variant="outline-success" className="me-2" onClick={exportarExcel}>
                            <FaFileExcel style={{ marginRight: 6, fontSize: 18, verticalAlign: 'middle' }} />
                            Descargar Excel
                        </Button>
                        {puedeCrear && (
                            <Button
                                variant="success"
                                onClick={() => {
                                    setEditingCita(null);
                                    setFormData({
                                        documentoCliente: '',
                                        nombreCliente: '',
                                        apellidoCliente: '',
                                        servicios: '',
                                        doctora: '',
                                        consultorio: '',
                                        fecha: '',
                                        hora: '',
                                    });
                                    setShowEditModal(true);
                                }}
                            >
                                Crear Nueva Cita
                            </Button>
                        )}
                    </div>
                </div>
                <div className="table-responsive shadow-sm rounded">
                    <Table responsive striped hover className="mb-0">
                        <thead style={{ backgroundColor: colorScheme.primary, color: colorScheme.light }}>
                            <tr>
                                <th>Documento</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Servicio</th>
                                <th>Doctora</th>
                                <th>Consultorio</th>
                                <th>Fecha</th>
                                <th>Hora</th>
                                { (puedeEditar || puedeBorrar) && <th>Acciones</th> }
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((cita) => (
                                <tr key={cita._id}>
                                    <td>{cita.documentoCliente}</td>
                                    <td>{cita.nombreCliente}</td>
                                    <td>{cita.apellidoCliente}</td>
                                    <td>{
                                        servicios.find(s => s._id === (cita.servicios?._id || cita.servicios))?.Nombre || 'Sin asignar'
                                    }</td>
                                    <td>{
                                        (() => {
                                            const doc = doctoras.find(d => d._id === (cita.doctora?._id || cita.doctora));
                                            return doc ? `${doc.Nombres} ${doc.Apellidos}` : 'Sin asignar';
                                        })()
                                    }</td>
                                    <td>{
                                        consultorios.find(c => c._id === (cita.consultorio?._id || cita.consultorio))?.Nombre_consultorio || 'Sin asignar'
                                    }</td>
                                    <td>{cita.fecha ? cita.fecha.split('T')[0] : 'N/A'}</td>
                                    <td>{cita.hora || 'N/A'}</td>
                                    { (puedeEditar || puedeBorrar) && (
                                    <td>
                                        {puedeEditar && (
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleEdit(cita)}
                                            >
                                                <FaEdit />
                                            </Button>
                                        )}
                                        {puedeBorrar && (
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDeleteClick(cita)}
                                            >
                                                <FaTrash />
                                            </Button>
                                        )}
                                        {((userRol === 'DOCTORA' || userRol === 'ADMIN') && cita.estado !== 'Terminado') && (
                                            <Button
                                                variant="outline-success"
                                                size="sm"
                                                className="ms-2"
                                                title="Confirmar asistencia"
                                                onClick={() => confirmarAsistencia(cita._id)}
                                            >
                                                <FaCheckCircle />
                                            </Button>
                                        )}
                                    </td>
                                    )}
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

                {/* Modal de edición/creación */}
                <ModalEditarCita
                  show={showEditModal}
                  onHide={() => setShowEditModal(false)}
                  onSubmit={handleSubmit}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  editingCita={editingCita}
                  servicios={servicios}
                  doctoras={doctoras}
                  consultorios={consultorios}
                />

                {/* Modal de eliminación */}
                <ModalEliminarCita
                  show={showDeleteModal}
                  onHide={() => setShowDeleteModal(false)}
                  onConfirm={confirmDelete}
                  citaToDelete={citaToDelete}
                />

                {successMsg && (
                    <div style={{ position: 'fixed', top: 80, right: 30, zIndex: 9999 }}>
                        <div className="alert alert-success" role="alert">
                            {successMsg}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TablaCitas;