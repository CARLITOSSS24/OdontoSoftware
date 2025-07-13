import React, { useState, useEffect, useContext } from 'react';
import api from '../API/axiosInstance';
import { Button, Table } from 'react-bootstrap';
import { AuthContext } from '../contexts/AuthContext';
import NavBarCrud from './NavBar/NavBarCrud';
import { ModalCrearHistorial, ModalVerHistorial  } from './Modales/ModalHistorial';
import '../styles/globalTableStyles.css';

const TablaHistoriales = () => {
  const { user } = useContext(AuthContext);
  const [historiales, setHistoriales] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [doctoras, setDoctoras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modales
  const [showCrear, setShowCrear] = useState(false);
  const [showVer, setShowVer] = useState(false);
  const [historialSeleccionado, setHistorialSeleccionado] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = historiales.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(historiales.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [h, p, d] = await Promise.all([
        api.get('/historiales'),
        api.get('/users'), // Filtra pacientes abajo
        api.get('/doctora')
      ]);
      setHistoriales(h.data);
      setPacientes(p.data.filter(u => u.Permiso?.rol === 'PACIENTE' || u.Permiso === 'PACIENTE'));
      setDoctoras(d.data);
      setError(null);
    } catch (e) {
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleHistorialCreado = (nuevo) => {
    fetchAll();
    setShowCrear(false);
  };

  const handleControlAgregado = (actualizado) => {
    setHistoriales(historiales.map(h => h._id === actualizado._id ? actualizado : h));
    setHistorialSeleccionado(actualizado);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#ecf0f1' }}>
      <NavBarCrud userRol={user.Permiso?.rol || user.Permiso} />
      <div className="flex-grow-1 p-4">
        <h1 className="text-center mb-4">Gestión de Historiales Clínicos</h1>
        <div className="d-flex justify-content-end mb-3">
          <Button variant="success" onClick={() => setShowCrear(true)}>
            Crear Nuevo Historial
          </Button>
        </div>
        <Table responsive striped hover>
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Documento</th>
              <th>Fecha de Creación</th>
              <th>Responsable</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map(h => (
              <tr key={h._id}>
                <td>{h.paciente?.Nombre} {h.paciente?.Apellido}</td>
                <td>{h.paciente?.Doc_identificacion}</td>
                <td>{h.fecha_creacion?.slice(0,10)}</td>
                <td>{h.responsable_creacion ? `${h.responsable_creacion.Nombres} ${h.responsable_creacion.Apellidos}` : ''}</td>
                <td>
                  <Button size="sm" variant="primary" onClick={() => { setHistorialSeleccionado(h); setShowVer(true); }}>
                    Ver
                  </Button>
                </td>
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
        <ModalCrearHistorial
          show={showCrear}
          onHide={() => setShowCrear(false)}
          pacientes={pacientes}
          doctoras={doctoras}
          onHistorialCreado={handleHistorialCreado}
        />
        <ModalVerHistorial
          show={showVer}
          onHide={() => setShowVer(false)}
          historial={historialSeleccionado}
          doctoras={doctoras}
          onControlAgregado={handleControlAgregado}
        />
      </div>
    </div>
  );
};

export default TablaHistoriales;