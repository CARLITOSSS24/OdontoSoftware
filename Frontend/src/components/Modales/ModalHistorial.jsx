import React, { useState } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import api from '../../API/axiosInstance';

export const ModalCrearHistorial = ({ show, onHide, pacientes, doctoras, onHistorialCreado, extraCheckbox }) => {
  const [form, setForm] = useState({ paciente: '', responsable_creacion: '', observaciones_generales: '', correo: '', telefono: '' });
  const [error, setError] = useState(null);
  const [busquedaPaciente, setBusquedaPaciente] = useState('');

  const pacientesFiltrados = pacientes.filter(p =>
    (p.Nombre + ' ' + p.Apellido).toLowerCase().includes(busquedaPaciente.toLowerCase()) ||
    p.Doc_identificacion?.toLowerCase().includes(busquedaPaciente.toLowerCase())
  );

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      const { data } = await api.post('/historiales', form);
      onHistorialCreado(data);
      setForm({ paciente: '', responsable_creacion: '', observaciones_generales: '', correo: '', telefono: '' });
      onHide();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al crear historial');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Crear Historial Clínico</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          {extraCheckbox && (
            <Form.Check
              type="checkbox"
              className="mb-3"
              label={extraCheckbox.label}
              checked={extraCheckbox.checked}
              onChange={extraCheckbox.onChange}
            />
          )}
          <Form.Group className="mb-3">
            <Form.Label>Buscar paciente</Form.Label>
            <Form.Control
              type="text"
              placeholder="Buscar por nombre o documento"
              value={busquedaPaciente}
              onChange={e => setBusquedaPaciente(e.target.value)}
            />
            <Form.Label className="mt-2">Seleccione paciente</Form.Label>
            <Form.Select name="paciente" value={form.paciente} onChange={handleChange} required>
              <option value="">Seleccione paciente</option>
              {pacientesFiltrados.map(p => (
                <option key={p._id} value={p._id}>{p.Nombre} {p.Apellido} - {p.Doc_identificacion}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Odontólogo responsable</Form.Label>
            <Form.Select name="responsable_creacion" value={form.responsable_creacion} onChange={handleChange} required>
              <option value="">Seleccione odontólogo</option>
              {doctoras.map(d => (
                <option key={d._id} value={d._id}>{d.Nombres} {d.Apellidos}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Correo del paciente</Form.Label>
            <Form.Control name="correo" value={form.correo} onChange={handleChange} disabled />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Teléfono del paciente</Form.Label>
            <Form.Control name="telefono" value={form.telefono} onChange={handleChange} disabled />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Observaciones generales</Form.Label>
            <Form.Control as="textarea" name="observaciones_generales" value={form.observaciones_generales} onChange={handleChange} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancelar</Button>
          <Button type="submit" variant="primary">Guardar</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export const ModalVerHistorial = ({ show, onHide, historial, doctoras, onControlAgregado }) => {
  const [showAgregar, setShowAgregar] = useState(false);

  if (!historial) return null;

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Historial de {historial.paciente?.Nombre} {historial.paciente?.Apellido}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <strong>Responsable:</strong> {historial.responsable_creacion ? `${historial.responsable_creacion.Nombres} ${historial.responsable_creacion.Apellidos}` : ''}<br />
            <strong>Observaciones generales:</strong> {historial.observaciones_generales || 'N/A'}
          </div>
          <hr />
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5>Controles (Timeline)</h5>
            <Button size="sm" variant="success" onClick={() => setShowAgregar(true)}>
              Agregar Control
            </Button>
          </div>
          <Table striped hover>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Motivo</th>
                <th>Diagnóstico</th>
                <th>Procedimiento</th>
                <th>Odontólogo</th>
              </tr>
            </thead>
            <tbody>
              {historial.controles?.length > 0 ? historial.controles.map(ctrl => (
                <tr key={ctrl._id}>
                  <td>{ctrl.fecha_control?.slice(0,10)}</td>
                  <td>{ctrl.motivo_consulta}</td>
                  <td>{ctrl.diagnostico}</td>
                  <td>{ctrl.procedimiento_realizado}</td>
                  <td>{ctrl.odontologo_responsable?.nombre}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="text-center">Sin controles registrados</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
      <ModalAgregarControl
        show={showAgregar}
        onHide={() => setShowAgregar(false)}
        historialId={historial._id}
        doctoras={doctoras}
        onControlAgregado={onControlAgregado}
      />
    </>
  );
};

export const ModalAgregarControl = ({ show, onHide, historialId, doctoras, onControlAgregado }) => {
  const [form, setForm] = useState({
    fecha_control: new Date().toISOString().slice(0,10),
    motivo_consulta: '',
    diagnostico: '',
    procedimiento_realizado: '',
    tratamiento_propuesto: '',
    evolucion: '',
    recomendaciones: '',
    odontologo_responsable: ''
  });
  const [error, setError] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      const { data } = await api.post(`/historiales/${historialId}/agregar-control`, form);
      onControlAgregado(data.historial);
      setForm({
        fecha_control: new Date().toISOString().slice(0,10),
        motivo_consulta: '',
        diagnostico: '',
        procedimiento_realizado: '',
        tratamiento_propuesto: '',
        evolucion: '',
        recomendaciones: '',
        odontologo_responsable: ''
      });
      onHide();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al agregar control');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Control</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          <Form.Group className="mb-2">
            <Form.Label>Fecha</Form.Label>
            <Form.Control type="date" name="fecha_control" value={form.fecha_control} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Motivo de consulta</Form.Label>
            <Form.Control name="motivo_consulta" value={form.motivo_consulta} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Diagnóstico</Form.Label>
            <Form.Control name="diagnostico" value={form.diagnostico} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Procedimiento realizado</Form.Label>
            <Form.Control name="procedimiento_realizado" value={form.procedimiento_realizado} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Tratamiento propuesto</Form.Label>
            <Form.Control name="tratamiento_propuesto" value={form.tratamiento_propuesto} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Evolución</Form.Label>
            <Form.Control name="evolucion" value={form.evolucion} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Recomendaciones</Form.Label>
            <Form.Control name="recomendaciones" value={form.recomendaciones} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Odontólogo responsable</Form.Label>
            <Form.Select name="odontologo_responsable" value={form.odontologo_responsable} onChange={handleChange} required>
              <option value="">Seleccione odontólogo</option>
              {doctoras.map(d => (
                <option key={d._id} value={d._id}>{d.Nombres} {d.Apellidos}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancelar</Button>
          <Button type="submit" variant="primary">Guardar</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};