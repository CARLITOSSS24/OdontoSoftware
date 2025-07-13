import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaUsers, FaCalendarAlt, FaTooth, FaUserMd, FaClinicMedical, FaHistory, FaTachometerAlt } from 'react-icons/fa';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../API/axiosInstance';
import { Link } from 'react-router-dom';
import NavBarCrud from '../../components/NavBar/NavBarCrud';

const palette = {
  primary: '#556f70',
  secondary: '#49b6b2',
  light: '#eef6f6',
  accent: '#95bfbd',
  gray: '#7d7e7d',
  grayLight: '#8c9694',
};

const sidebarLinks = [
  { to: '/admin/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
  { to: '/admin/usuarios', icon: <FaUsers />, label: 'Usuarios' },
  { to: '/admin/citas', icon: <FaCalendarAlt />, label: 'Citas' },
  { to: '/admin/servicios', icon: <FaTooth />, label: 'Servicios' },
  { to: '/admin/doctores', icon: <FaUserMd />, label: 'Doctores' },
  { to: '/admin/consultorios', icon: <FaClinicMedical />, label: 'Consultorios' },
  { to: '/admin/historiales', icon: <FaHistory />, label: 'Historiales' },
];

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAppointments: 0,
    totalServices: 0,
    totalDoctors: 0,
    totalClinics: 0,
    totalHistories: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, appointments, services, doctors, clinics, histories] = await Promise.all([
          api.get('/users'),
          api.get('/citas'),
          api.get('/servicio'),
          api.get('/doctora'),
          api.get('/consultorios'),
          api.get('/historiales')
        ]);

        // Logs para depuración
        console.log('Usuarios:', users.data);
        console.log('Citas:', appointments.data);
        console.log('Servicios:', services.data);
        console.log('Doctores:', doctors.data);
        console.log('Consultorios:', clinics.data);
        console.log('Historiales:', histories.data);

        setStats({
          totalUsers: users.data.length,
          totalAppointments: appointments.data.length,
          totalServices: services.data.length,
          totalDoctors: doctors.data.length,
          totalClinics: clinics.data.length,
          totalHistories: histories.data.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const cardData = [
    { icon: <FaUsers />, label: 'Usuarios Totales', value: stats.totalUsers, color: '#49b6b2' },
    { icon: <FaCalendarAlt />, label: 'Citas Programadas', value: stats.totalAppointments, color: '#95bfbd' },
    { icon: <FaTooth />, label: 'Servicios Activos', value: stats.totalServices, color: '#556f70' },
    { icon: <FaUserMd />, label: 'Doctores Registrados', value: stats.totalDoctors, color: '#49b6b2' },
    { icon: <FaClinicMedical />, label: 'Consultorios Activos', value: stats.totalClinics, color: '#95bfbd' },
    { icon: <FaHistory />, label: 'Historiales Clínicos', value: stats.totalHistories, color: '#556f70' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: palette.light }}>
      <NavBarCrud userRol={user?.Permiso || ''} />
      <div style={{ flex: 1, padding: '2.5rem 3vw', minHeight: '100vh', position: 'relative' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(90deg, #49b6b2 0%, #556f70 100%)',
          borderRadius: 18,
          padding: '2rem 2.5rem',
          marginBottom: 36,
          color: '#fff',
          boxShadow: '0 4px 24px rgba(73,182,178,0.10)',
          display: 'flex',
          alignItems: 'center',
          gap: 24
        }}>
          <FaTachometerAlt size={48} style={{ opacity: 0.85 }} />
          <div>
            <h1 style={{ fontWeight: 800, fontSize: 36, margin: 0 }}>
              Bienvenido, {user?.Nombre || 'Administrador'}
            </h1>
            <div style={{ fontSize: 18, opacity: 0.9 }}>Panel de Control - Administración General</div>
          </div>
        </div>
        {/* Cards */}
        <Row className="g-4">
          {cardData.map((card, idx) => (
            <Col xs={12} md={6} lg={4} key={idx}>
              <Card
                style={{
                  background: `linear-gradient(135deg, ${card.color} 0%, #49b6b2 100%)`,
                  color: '#fff',
                  borderRadius: 18,
                  padding: '1.5rem 1.2rem',
                  minHeight: 170,
                  boxShadow: '0 4px 24px rgba(85,111,112,0.10)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                  transition: 'transform 0.18s',
                  cursor: 'pointer',
                  marginBottom: 12
                }}
                className="dashboard-card"
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)'}
                onMouseOut={e => e.currentTarget.style.transform = 'none'}
              >
                <div style={{ fontSize: 38, opacity: 0.92 }}>{card.icon}</div>
                <div>
                  <div style={{ fontSize: 32, fontWeight: 700 }}>{card.value}</div>
                  <div style={{ fontSize: 18, opacity: 0.93 }}>{card.label}</div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default AdminDashboard; 