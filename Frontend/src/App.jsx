import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import TablaUsuarios from './components/TablaUser';
import TablaPermisos from './components/TablaPermisos';
import TablaServicios from './components/TablaServicios';
import TablaConsultorios from './components/TablaConsultorios';
import TablaDoctores from './components/TablaDoctores';
import TablaCitas from './components/TablaCitas';
import TablaHistoriales from './components/TablaHistoriales';
import MiCitasDoctores from './components/MiCitasDoctores';
import Login from './components/Login';
import Register from './components/Register';
import HomePage from './pages/HomePage';
import Contactenos from './pages/Contactenos';
import Nosotros from './pages/Nosotros';
import Perfil from './pages/Perfil';
import AgendarCitas from './pages/AgedarCitas';
import MisCitas from './pages/MisCitas';
import VerMiHistoria from './pages/VerMiHistoria';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import DoctorDashboard from './pages/dashboards/DoctorDashboard';
import ReceptionistDashboard from './pages/dashboards/ReceptionistDashboard';
import PacienteDashboard from './pages/dashboards/PacienteDashboard';
import { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';
import NavBar from './components/NavBar/NavBar';

function App() {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  if (user && (location.pathname === '/login' || location.pathname === '/register')) {
    const userRol = typeof user.Permiso === "string" ? user.Permiso : user.Permiso?.rol || "";
    if (userRol === "ADMIN") return <Navigate to="/admin/dashboard" replace />;
    if (userRol === "DOCTORA") return <Navigate to="/doctora/dashboard" replace />;
    if (userRol === "RECEPCIONISTA") return <Navigate to="/recepcionista/dashboard" replace />;
    if (userRol === "PACIENTE") return <Navigate to="/paciente/dashboard" replace />;
  }

  return (
    <Routes>
      {/* Páginas públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/contactenos" element={<Contactenos />} />
      <Route path="/nosotros" element={<Nosotros />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Páginas para PACIENTE */}
      <Route path="/ver-mi-historia" element={
        <PrivateRoute roles={["PACIENTE"]}><VerMiHistoria /></PrivateRoute>
      } />
      <Route path="/perfil" element={
        <PrivateRoute roles={["PACIENTE"]}><Perfil /></PrivateRoute>
      } />
      <Route path="/agendar-cita" element={
        <PrivateRoute roles={["PACIENTE"]}><AgendarCitas /></PrivateRoute>
      } />
      <Route path="/mis-citas" element={
        <PrivateRoute roles={["PACIENTE"]}><MisCitas /></PrivateRoute>
      } />
      <Route path="/paciente/dashboard" element={
        <PrivateRoute roles={["PACIENTE"]}>
          <>
            <NavBar />
            <PacienteDashboard />
          </>
        </PrivateRoute>
      } />

      {/* Rutas para ADMIN */}
      <Route path="/admin/dashboard" element={
        <PrivateRoute roles={["ADMIN"]}><AdminDashboard /></PrivateRoute>
      } />
      <Route path="/admin/usuarios" element={
        <PrivateRoute roles={["ADMIN"]}><TablaUsuarios /></PrivateRoute>
      } />
      <Route path="/admin/permisos" element={
        <PrivateRoute roles={["ADMIN"]}><TablaPermisos /></PrivateRoute>
      } />
      <Route path="/admin/servicios" element={
        <PrivateRoute roles={["ADMIN"]}><TablaServicios /></PrivateRoute>
      } />
      <Route path="/admin/citas" element={
        <PrivateRoute roles={["ADMIN"]}><TablaCitas /></PrivateRoute>
      } />
      <Route path="/admin/consultorios" element={
        <PrivateRoute roles={["ADMIN"]}><TablaConsultorios /></PrivateRoute>
      } />
      <Route path="/admin/doctores" element={
        <PrivateRoute roles={["ADMIN"]}><TablaDoctores /></PrivateRoute>
      } />
      <Route path="/admin/historiales" element={
        <PrivateRoute roles={["ADMIN"]}><TablaHistoriales /></PrivateRoute>
      } />

      {/* Rutas para DOCTORA */}
      <Route path="/doctora/dashboard" element={
        <PrivateRoute roles={["DOCTORA"]}><DoctorDashboard /></PrivateRoute>
      } />
      <Route path="/doctora/historiales" element={
        <PrivateRoute roles={["DOCTORA"]}><TablaHistoriales /></PrivateRoute>
      } />
      <Route path="/doctora/mis-citas" element={
        <PrivateRoute roles={["DOCTORA"]}>
          <MiCitasDoctores key={location.pathname} />
        </PrivateRoute>
      } />

      {/* Rutas para RECEPCIONISTA */}
      <Route path="/recepcionista/dashboard" element={
        <PrivateRoute roles={["RECEPCIONISTA"]}><ReceptionistDashboard /></PrivateRoute>
      } />
      <Route path="/recepcionista/historiales" element={
        <PrivateRoute roles={["RECEPCIONISTA"]}><TablaHistoriales /></PrivateRoute>
      } />
      <Route path="/recepcionista/consultorios" element={
        <PrivateRoute roles={["RECEPCIONISTA"]}><TablaConsultorios /></PrivateRoute>
      } />
      <Route path="/recepcionista/citas" element={
        <PrivateRoute roles={["RECEPCIONISTA"]}><TablaCitas /></PrivateRoute>
      } />

      {/* Ruta de unauthorized */}
      <Route path="/unauthorized" element={<div>No tienes permisos para acceder a esta página.</div>} />

      {/* Ruta por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
