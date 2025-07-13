import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

// Opciones para los selects
const tiposDocumento = [
  { value: "RC", label: "Registro Civil" },
  { value: "TI", label: "Tarjeta de Identidad" },
  { value: "CC", label: "Cédula de Ciudadanía" },
  { value: "TE", label: "Tarjeta de Extranjería" },
  { value: "CE", label: "Cédula de Extranjería" },
  { value: "NIT", label: "NIT" },
  { value: "PP", label: "Pasaporte" },
  { value: "PEP", label: "Permiso Especial de Permanencia" },
  { value: "DIE", label: "Documento de Identificación Extranjero" },
  { value: "PA", label: "Otro" }
];

const generos = [
  { value: "Masculino", label: "Masculino" },
  { value: "Femenino", label: "Femenino" },
  { value: "Otro", label: "Otro" }
];

// Ahora los permisos se reciben por props y deben ser [{_id, rol}]
export function ModalCrearUsuario({
  show,
  onHide,
  onSubmit,
  formData,
  formErrors,
  handleInputChange,
  permisos // <-- ahora viene por props
}) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Crear Usuario</Modal.Title>
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
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              name="Apellido"
              value={formData.Apellido}
              onChange={handleInputChange}
              isInvalid={!!formErrors.Apellido}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.Apellido}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tipo de Documento</Form.Label>
            <Form.Select
              name="Tipo_Doc"
              value={formData.Tipo_Doc}
              onChange={handleInputChange}
              isInvalid={!!formErrors.Tipo_Doc}
            >
              <option value="">Seleccione...</option>
              {tiposDocumento.map((td) => (
                <option key={td.value} value={td.value}>{td.label}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {formErrors.Tipo_Doc}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Documento de Identificación</Form.Label>
            <Form.Control
              type="text"
              name="Doc_identificacion"
              value={formData.Doc_identificacion}
              onChange={handleInputChange}
              isInvalid={!!formErrors.Doc_identificacion}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.Doc_identificacion}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="number"
              name="Telefono"
              value={formData.Telefono}
              onChange={handleInputChange}
              isInvalid={!!formErrors.Telefono}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.Telefono}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Correo</Form.Label>
            <Form.Control
              type="email"
              name="Correo"
              value={formData.Correo}
              onChange={handleInputChange}
              isInvalid={!!formErrors.Correo}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.Correo}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Clave</Form.Label>
            <Form.Control
              type="password"
              name="Clave"
              value={formData.Clave}
              onChange={handleInputChange}
              isInvalid={!!formErrors.Clave}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.Clave}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Permiso</Form.Label>
            <Form.Select
              name="Permiso"
              value={formData.Permiso}
              onChange={handleInputChange}
              isInvalid={!!formErrors.Permiso}
            >
              <option value="">Seleccione...</option>
              {permisos && permisos.map((p) => (
                <option key={p._id} value={p._id}>{p.rol}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {formErrors.Permiso}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Género</Form.Label>
            <Form.Select
              name="Genero"
              value={formData.Genero}
              onChange={handleInputChange}
              isInvalid={!!formErrors.Genero}
            >
              <option value="">Seleccione...</option>
              {generos.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {formErrors.Genero}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Edad</Form.Label>
            <Form.Control
              type="number"
              name="Edad"
              value={formData.Edad}
              onChange={handleInputChange}
              isInvalid={!!formErrors.Edad}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.Edad}
            </Form.Control.Feedback>
          </Form.Group>
          <Button variant="primary" type="submit">
            Crear Usuario
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export function ModalEditarUsuario({
  show,
  onHide,
  onSubmit,
  formData,
  formErrors,
  handleInputChange,
  permisos // <-- ahora viene por props
}) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Usuario</Modal.Title>
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
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              name="Apellido"
              value={formData.Apellido}
              onChange={handleInputChange}
              isInvalid={!!formErrors.Apellido}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.Apellido}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tipo de Documento</Form.Label>
            <Form.Select
              name="Tipo_Doc"
              value={formData.Tipo_Doc}
              onChange={handleInputChange}
              isInvalid={!!formErrors.Tipo_Doc}
            >
              <option value="">Seleccione...</option>
              {tiposDocumento.map((td) => (
                <option key={td.value} value={td.value}>{td.label}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {formErrors.Tipo_Doc}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Documento de Identificación</Form.Label>
            <Form.Control
              type="text"
              name="Doc_identificacion"
              value={formData.Doc_identificacion}
              onChange={handleInputChange}
              isInvalid={!!formErrors.Doc_identificacion}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.Doc_identificacion}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="number"
              name="Telefono"
              value={formData.Telefono}
              onChange={handleInputChange}
              isInvalid={!!formErrors.Telefono}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.Telefono}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Correo</Form.Label>
            <Form.Control
              type="email"
              name="Correo"
              value={formData.Correo}
              onChange={handleInputChange}
              isInvalid={!!formErrors.Correo}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.Correo}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Permiso</Form.Label>
            <Form.Select
              name="Permiso"
              value={formData.Permiso}
              onChange={handleInputChange}
              isInvalid={!!formErrors.Permiso}
            >
              <option value="">Seleccione...</option>
              {permisos && permisos.map((p) => (
                <option key={p._id} value={p._id}>{p.rol}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {formErrors.Permiso}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Género</Form.Label>
            <Form.Select
              name="Genero"
              value={formData.Genero}
              onChange={handleInputChange}
              isInvalid={!!formErrors.Genero}
            >
              <option value="">Seleccione...</option>
              {generos.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {formErrors.Genero}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Edad</Form.Label>
            <Form.Control
              type="number"
              name="Edad"
              value={formData.Edad}
              onChange={handleInputChange}
              isInvalid={!!formErrors.Edad}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.Edad}
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

export function ModalEliminarUsuario({
  show,
  onHide,
  onConfirm,
  userToDelete
}) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro de que deseas eliminar al usuario <strong>{userToDelete?.Nombre} {userToDelete?.Apellido}</strong>?
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