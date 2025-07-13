import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export function ModalEditarPermiso({
  show,
  onHide,
  onSubmit,
  formData,
  formErrors,
  handleInputChange,
  editingPermiso
}) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{editingPermiso ? 'Editar Permiso' : 'Crear Permiso'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Rol</Form.Label>
            <Form.Control
              type="text"
              name="rol"
              value={formData.rol}
              onChange={handleInputChange}
              isInvalid={!!formErrors.rol}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.rol}
            </Form.Control.Feedback>
          </Form.Group>
          <Button variant="primary" type="submit">
            Guardar Cambios
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export function ModalEliminarPermiso({
  show,
  onHide,
  onConfirm,
  permisoToDelete
}) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro de que deseas eliminar el permiso <strong>{permisoToDelete?.rol}</strong>?
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