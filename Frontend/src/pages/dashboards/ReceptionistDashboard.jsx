import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, ListGroup, Button } from 'react-bootstrap';
import { FaCalendarAlt, FaUserPlus, FaUserCheck, FaClock, FaSearch } from 'react-icons/fa';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../API/axiosInstance';
import NavBarCrud from '../../components/NavBar/NavBarCrud';

const ReceptionistDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ minHeight: '100vh', background: '#eef6f6', display: 'flex' }}>
      <NavBarCrud userRol={user?.Permiso?.rol || user?.Permiso || ''} />
      <div style={{ flex: 1, padding: '40px 24px 24px 24px', maxWidth: '100vw' }}>
        <Container fluid className="py-2 px-0">
          <h1 style={{ color: '#556f70', fontWeight: 700, marginBottom: 0 }}>
            ¡Bienvenida, Recepcionista {user?.Nombre || ''}!
          </h1>
        </Container>
      </div>
    </div>
  );
};

export default ReceptionistDashboard; 