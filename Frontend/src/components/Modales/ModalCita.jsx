import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export function ModalEditarCita({
  show,
  onHide,
  onSubmit,
  formData,
  handleInputChange,
  editingCita,
  servicios = [],
  doctoras = [],
  consultorios = []
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData
    };
    onSubmit(payload);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{editingCita ? 'Editar Cita' : 'Crear Cita'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Documento Cliente</Form.Label>
            <Form.Control
              type="text"
              name="documentoCliente"
              value={formData.documentoCliente}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nombre Cliente</Form.Label>
            <Form.Control
              type="text"
              name="nombreCliente"
              value={formData.nombreCliente}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Apellido Cliente</Form.Label>
            <Form.Control
              type="text"
              name="apellidoCliente"
              value={formData.apellidoCliente}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Servicio</Form.Label>
            <Form.Select
              name="servicios"
              value={formData.servicios}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccione un servicio</option>
              {servicios.map(servicio => (
                <option key={servicio._id} value={servicio._id}>{servicio.Nombre}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Doctora</Form.Label>
            <Form.Select
              name="doctora"
              value={formData.doctora}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccione una doctora</option>
              {doctoras.map(doc => (
                 <option key={doc._id} value={doc._id}>
                  {doc.Nombres} {doc.Apellidos} {doc.Cargo?.nombre ? `- ${doc.Cargo.nombre}` : ''}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Consultorio</Form.Label>
            <Form.Select
              name="consultorio"
              value={formData.consultorio}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccione un consultorio</option>
              {consultorios.map(consultorio => (
                <option key={consultorio._id} value={consultorio._id}>{consultorio.Nombre_consultorio}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Hora</Form.Label>
            <Form.Control
              type="time"
              name="hora"
              value={formData.hora}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Guardar
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export function ModalEliminarCita({
  show,
  onHide,
  onConfirm,
  citaToDelete
}) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro de que deseas eliminar la cita de <strong>{citaToDelete?.nombreCliente}</strong>?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
} 