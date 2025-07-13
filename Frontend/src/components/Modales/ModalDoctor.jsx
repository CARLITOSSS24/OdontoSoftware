import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';

const tiposDocumento = [
  { value: 'RC', label: 'Registro Civil' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'TE', label: 'Tarjeta de Extranjería' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'NIT', label: 'NIT' },
  { value: 'PP', label: 'Pasaporte' },
  { value: 'PEP', label: 'Permiso Especial de Permanencia' },
  { value: 'DIE', label: 'Documento de Identificación Extranjero' },
  { value: 'PA', label: 'Otro' }
];

const generos = [
  { value: 'Masculino', label: 'Masculino' },
  { value: 'Femenino', label: 'Femenino' },
  { value: 'Otro', label: 'Otro' }
];

const ModalDoctor = ({
  show,
  onHide,
  onSubmit,
  onDelete,
  mode, // 'crear' | 'editar'
  doctor,
  permisos = [],
  consultorios = [],
  cargos = [],
  loading = false,
  error = null
}) => {
  const [formData, setFormData] = useState({
    Nombres: '',
    Apellidos: '',
    Tipo_Doc: '',
    Doc_identificacion: '',
    Correo: '',
    Permiso: '',
    Id_consultorio: '',
    Telefono: '',
    Genero: '',
    Edad: '',
    Clave: '',
    cargo: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (doctor && mode === 'editar') {
      setFormData({
        Nombres: doctor.Nombres || '',
        Apellidos: doctor.Apellidos || '',
        Tipo_Doc: doctor.Tipo_Doc || '',
        Doc_identificacion: doctor.Doc_identificacion || '',
        Correo: doctor.Correo || '',
        Permiso: doctor.Permiso?._id || doctor.Permiso || '',
        Id_consultorio: doctor.Id_consultorio?._id || doctor.Id_consultorio || '',
        Telefono: doctor.Telefono || '',
        Genero: doctor.Genero || '',
        Edad: doctor.Edad || '',
        Clave: '',
        cargo: doctor.Cargo?._id || doctor.Cargo || ''
      });
    } else if (mode === 'crear') {
      setFormData({
        Nombres: '',
        Apellidos: '',
        Tipo_Doc: '',
        Doc_identificacion: '',
        Correo: '',
        Permiso: '',
        Id_consultorio: '',
        Telefono: '',
        Genero: '',
        Edad: '',
        Clave: '',
        cargo: ''
      });
    }
    setFormErrors({});
  }, [doctor, mode, show]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: null });
  };

  const validate = () => {
    const errors = {};
    if (!formData.Nombres.trim()) errors.Nombres = 'Nombres requeridos';
    if (!formData.Apellidos.trim()) errors.Apellidos = 'Apellidos requeridos';
    if (!formData.Tipo_Doc) errors.Tipo_Doc = 'Tipo de documento requerido';
    if (!formData.Doc_identificacion.trim()) errors.Doc_identificacion = 'Identificación requerida';
    if (!formData.Correo.trim()) errors.Correo = 'Correo requerido';
    if (!formData.Permiso) errors.Permiso = 'Permiso requerido';
    if (!formData.Id_consultorio) errors.Id_consultorio = 'Consultorio requerido';
    if (!String(formData.Telefono).trim()) errors.Telefono = 'Teléfono requerido';
    if (!formData.Genero) errors.Genero = 'Género requerido';
    if (!formData.Edad) errors.Edad = 'Edad requerida';
    if (!formData.cargo) errors.cargo = 'Cargo requerido';
    if (mode === 'crear' && !formData.Clave.trim()) errors.Clave = 'Clave requerida';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{mode === 'crear' ? 'Crear Doctor' : 'Editar Doctor'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombres</Form.Label>
            <Form.Control
              type="text"
              name="Nombres"
              value={formData.Nombres}
              onChange={handleChange}
              isInvalid={!!formErrors.Nombres}
              required
            />
            <Form.Control.Feedback type="invalid">{formErrors.Nombres}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Apellidos</Form.Label>
            <Form.Control
              type="text"
              name="Apellidos"
              value={formData.Apellidos}
              onChange={handleChange}
              isInvalid={!!formErrors.Apellidos}
              required
            />
            <Form.Control.Feedback type="invalid">{formErrors.Apellidos}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tipo de Documento</Form.Label>
            <Form.Select
              name="Tipo_Doc"
              value={formData.Tipo_Doc}
              onChange={handleChange}
              isInvalid={!!formErrors.Tipo_Doc}
              required
            >
              <option value="">Seleccione...</option>
              {tiposDocumento.map(td => (
                <option key={td.value} value={td.value}>{td.label}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{formErrors.Tipo_Doc}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Identificación</Form.Label>
            <Form.Control
              type="text"
              name="Doc_identificacion"
              value={formData.Doc_identificacion}
              onChange={handleChange}
              isInvalid={!!formErrors.Doc_identificacion}
              required
            />
            <Form.Control.Feedback type="invalid">{formErrors.Doc_identificacion}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Correo</Form.Label>
            <Form.Control
              type="email"
              name="Correo"
              value={formData.Correo}
              onChange={handleChange}
              isInvalid={!!formErrors.Correo}
              required
            />
            <Form.Control.Feedback type="invalid">{formErrors.Correo}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Permiso</Form.Label>
            <Form.Select
              name="Permiso"
              value={formData.Permiso}
              onChange={handleChange}
              isInvalid={!!formErrors.Permiso}
              required
            >
              <option value="">Seleccione...</option>
              {permisos.map(p => (
                <option key={p._id} value={p._id}>{p.rol}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{formErrors.Permiso}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Consultorio</Form.Label>
            <Form.Select
              name="Id_consultorio"
              value={formData.Id_consultorio}
              onChange={handleChange}
              isInvalid={!!formErrors.Id_consultorio}
              required
            >
              <option value="">Seleccione...</option>
              {consultorios.map(c => (
                <option key={c._id} value={c._id}>{c.Nombre_consultorio}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{formErrors.Id_consultorio}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="number"
              name="Telefono"
              value={formData.Telefono}
              onChange={handleChange}
              isInvalid={!!formErrors.Telefono}
              required
            />
            <Form.Control.Feedback type="invalid">{formErrors.Telefono}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Género</Form.Label>
            <Form.Select
              name="Genero"
              value={formData.Genero}
              onChange={handleChange}
              isInvalid={!!formErrors.Genero}
              required
            >
              <option value="">Seleccione...</option>
              {generos.map(g => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{formErrors.Genero}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Edad</Form.Label>
            <Form.Control
              type="number"
              name="Edad"
              value={formData.Edad}
              onChange={handleChange}
              isInvalid={!!formErrors.Edad}
              min={0}
              max={120}
              required
            />
            <Form.Control.Feedback type="invalid">{formErrors.Edad}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Cargo</Form.Label>
            <Form.Select
              name="cargo"
              value={formData.cargo}
              onChange={handleChange}
              isInvalid={!!formErrors.cargo}
              required
            >
              <option value="">Seleccione...</option>
              {cargos.map(c => (
                <option key={c._id} value={c._id}>{c.nombre}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{formErrors.cargo}</Form.Control.Feedback>
          </Form.Group>
          {mode === 'crear' && (
            <Form.Group className="mb-3">
              <Form.Label>Clave</Form.Label>
              <Form.Control
                type="password"
                name="Clave"
                value={formData.Clave}
                onChange={handleChange}
                isInvalid={!!formErrors.Clave}
                minLength={6}
                required
                placeholder="Mínimo 6 caracteres"
              />
              <Form.Control.Feedback type="invalid">{formErrors.Clave}</Form.Control.Feedback>
            </Form.Group>
          )}
          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={onHide} disabled={loading}>
              Cancelar
            </Button>
            {mode === 'editar' && false && (
              <Button variant="danger" onClick={() => onDelete(doctor)} disabled={loading}>
                Eliminar
              </Button>
            )}
            <Button variant="primary" type="submit" disabled={loading}>
              {mode === 'crear' ? 'Crear' : 'Guardar Cambios'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

ModalDoctor.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  mode: PropTypes.oneOf(['crear', 'editar']).isRequired,
  doctor: PropTypes.object,
  permisos: PropTypes.array,
  consultorios: PropTypes.array,
  cargos: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.string
};

export default ModalDoctor;
