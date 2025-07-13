import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export function ModalEditarConsultorio({
  show,
  onHide,
  onSubmit,
  formData,
  handleInputChange,
  editingConsultorio
}) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{editingConsultorio ? 'Editar Consultorio' : 'Crear Consultorio'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre del Consultorio</Form.Label>
            <Form.Control
              type="text"
              name="Nombre_consultorio"
              value={formData.Nombre_consultorio}
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

export function ModalEliminarConsultorio({
  show,
  onHide,
  onConfirm,
  consultorioToDelete
}) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro de que deseas eliminar el consultorio <strong>{consultorioToDelete?.Nombre_consultorio}</strong>?
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