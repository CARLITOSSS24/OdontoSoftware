import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export function ModalEditarServicio({
  show,
  onHide,
  onSubmit,
  formData,
  formErrors,
  handleInputChange,
  editingServicio
}) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{editingServicio ? 'Editar Servicio' : 'Crear Servicio'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="Nombre"
              value={formData.Nombre}
              onChange={handleInputChange}
              isInvalid={!!formErrors.Nombre}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.Nombre}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              type="text"
              name="Descripcion"
              value={formData.Descripcion}
              onChange={handleInputChange}
              isInvalid={!!formErrors.Descripcion}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.Descripcion}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Disponible</Form.Label>
            <Form.Select
              name="Disponible"
              value={formData.Disponible}
              onChange={handleInputChange}
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              name="Precio"
              value={formData.Precio}
              onChange={handleInputChange}
              isInvalid={!!formErrors.Precio}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.Precio}
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

export function ModalEliminarServicio({
  show,
  onHide,
  onConfirm,
  servicioToDelete
}) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro de que deseas eliminar el servicio <strong>{servicioToDelete?.Nombre}</strong>?
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