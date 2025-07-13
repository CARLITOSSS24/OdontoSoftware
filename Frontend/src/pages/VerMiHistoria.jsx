import NavBar from '../components/NavBar/NavBar';
import Footer from '../components/Footer';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../API/axiosInstance';
import { Card, Button, Table, Alert, Spinner } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const VerMiHistoria = () => {
  const { user } = useContext(AuthContext);
  const [historial, setHistorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistorial = async () => {
      setLoading(true);
      setError(null);
      try {
        // Obtener el historial clínico del usuario autenticado
        const idPaciente = user?._id || user?.id;
        if (!idPaciente) {
          setError('No se pudo identificar al usuario.');
          setLoading(false);
          return;
        }
        const res = await api.get(`/historiales/paciente/${idPaciente}`);
        setHistorial(res.data);
      } catch {
        setError('Aun no tienes historiales.');
      }
      setLoading(false);
    };
    fetchHistorial();
  }, [user]);

  const handleDescargarPDF = () => {
    if (!historial) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Historia Clínica', 14, 18);
    doc.setFontSize(12);
    doc.text(`Paciente: ${historial.paciente?.Nombre || ''} ${historial.paciente?.Apellido || ''}`, 14, 28);
    doc.text(`Documento: ${historial.paciente?.Doc_identificacion || ''}`, 14, 36);
    doc.text(`Fecha de creación: ${historial.fecha_creacion ? historial.fecha_creacion.split('T')[0] : ''}`, 14, 44);
    doc.text(`Responsable: ${historial.responsable_creacion?.Nombres || ''} ${historial.responsable_creacion?.Apellidos || ''}`, 14, 52);
    doc.text(`Observaciones: ${historial.observaciones_generales || 'N/A'}`, 14, 60);
    // Tabla de controles
    if (historial.controles && historial.controles.length > 0) {
      autoTable(doc, {
        startY: 70,
        head: [[
          'Fecha',
          'Motivo',
          'Diagnóstico',
          'Procedimiento',
          'Tratamiento',
          'Evolución',
          'Recomendaciones',
          'Odontólogo'
        ]],
        body: historial.controles.map(ctrl => [
          ctrl.fecha_control ? ctrl.fecha_control.split('T')[0] : '',
          ctrl.motivo_consulta,
          ctrl.diagnostico,
          ctrl.procedimiento_realizado,
          ctrl.tratamiento_propuesto || '',
          ctrl.evolucion || '',
          ctrl.recomendaciones || '',
          ctrl.odontologo_responsable?.Nombres || ''
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [73, 182, 178] },
      });
    }
    doc.save('historia_clinica.pdf');
  };

  return (
    <>
      <NavBar />
      <div className="container py-4">
        <h2 className="mb-4 text-center">Mi Historia Clínica</h2>
        {loading && <div className="text-center"><Spinner animation="border" /></div>}
        {error && <Alert variant="danger">{error}</Alert>}
        {historial && (
          <Card className="mb-4" style={{ maxWidth: 900, margin: '0 auto', borderRadius: 18, boxShadow: '0 2px 12px rgba(73,182,178,0.08)' }}>
            <Card.Body>
              <Card.Title style={{ fontWeight: 700, color: '#49b6b2' }}>Paciente: {historial.paciente?.Nombre} {historial.paciente?.Apellido}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Documento: {historial.paciente?.Doc_identificacion}</Card.Subtitle>
              <div><strong>Fecha de creación:</strong> {historial.fecha_creacion ? historial.fecha_creacion.split('T')[0] : ''}</div>
              <div><strong>Responsable:</strong> {historial.responsable_creacion?.Nombres} {historial.responsable_creacion?.Apellidos}</div>
              <div><strong>Observaciones:</strong> {historial.observaciones_generales || 'N/A'}</div>
              <hr />
              <h5>Controles</h5>
              {(!historial.controles || historial.controles.length === 0) && <div>No hay controles registrados.</div>}
              {historial.controles && historial.controles.length > 0 && (
                <Table striped bordered hover responsive size="sm">
                  <thead style={{ background: '#49b6b2', color: '#fff' }}>
                    <tr>
                      <th>Fecha</th>
                      <th>Motivo</th>
                      <th>Diagnóstico</th>
                      <th>Procedimiento</th>
                      <th>Tratamiento</th>
                      <th>Evolución</th>
                      <th>Recomendaciones</th>
                      <th>Odontólogo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.controles.map(ctrl => (
                      <tr key={ctrl._id}>
                        <td>{ctrl.fecha_control ? ctrl.fecha_control.split('T')[0] : ''}</td>
                        <td>{ctrl.motivo_consulta}</td>
                        <td>{ctrl.diagnostico}</td>
                        <td>{ctrl.procedimiento_realizado}</td>
                        <td>{ctrl.tratamiento_propuesto || ''}</td>
                        <td>{ctrl.evolucion || ''}</td>
                        <td>{ctrl.recomendaciones || ''}</td>
                        <td>{ctrl.odontologo_responsable?.Nombres || ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
              <div className="text-end mt-3">
                <Button variant="primary" onClick={handleDescargarPDF}>
                  Descargar PDF
                </Button>
              </div>
            </Card.Body>
          </Card>
        )}
      </div>
      <Footer />
    </>
  );
};

export default VerMiHistoria;
