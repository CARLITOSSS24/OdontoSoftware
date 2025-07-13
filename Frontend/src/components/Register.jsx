import React, { useState } from 'react';
import api from '../API/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const palette = {
  primary: '#556f70',
  secondary: '#49b6b2',
  light: '#eef6f6',
  accent: '#95bfbd',
  gray: '#7d7e7d',
  grayLight: '#8c9694',
};

const opcionesTipoDoc = [
  { value: "RC", label: "Registro Civil de Nacimiento" },
  { value: "TI", label: "Tarjeta de Identidad" },
  { value: "CC", label: "Cédula de Ciudadanía" },
  { value: "TE", label: "Tarjeta de Extranjería" },
  { value: "CE", label: "Cédula de Extranjería" },
  { value: "NIT", label: "NIT" },
  { value: "PP", label: "Pasaporte" },
  { value: "PEP", label: "Permiso Especial de Permanencia" },
  { value: "DIE", label: "Documento de Identificación Extranjero" },
  { value: "PA", label: "Pasaporte (compatibilidad)" },
];

const opcionesGenero = [
  { value: "Masculino", label: "Masculino" },
  { value: "Femenino", label: "Femenino" },
  { value: "Otro", label: "Otro" },
];

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Nombre: '',
    Apellido: '',
    Tipo_Doc: '',
    Doc_identificacion: '',
    Telefono: '',
    Correo: '',
    Clave: '',
    Permiso: '6820f7c214cd039b43a1f66c', // ID fijo para PACIENTE
    Genero: '',
    Edad: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState(null);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationCorreo, setVerificationCorreo] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState('');
  const [verificationLoading, setVerificationLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.Nombre.trim()) errors.Nombre = 'Nombre es requerido';
    if (!formData.Apellido.trim()) errors.Apellido = 'Apellido es requerido';
    if (!formData.Tipo_Doc.trim()) errors.Tipo_Doc = 'Tipo de documento es requerido';
    if (!formData.Doc_identificacion.trim()) errors.Doc_identificacion = 'Documento es requerido';
    if (!formData.Telefono.trim() || isNaN(formData.Telefono)) errors.Telefono = 'Teléfono es requerido y debe ser numérico';
    if (!formData.Correo.trim()) errors.Correo = 'Correo es requerido';
    if (!formData.Clave.trim()) errors.Clave = 'Clave es requerida';
    else if (formData.Clave.length < 8) errors.Clave = 'La clave debe tener al menos 8 caracteres';
    if (!formData.Genero.trim()) errors.Genero = 'El género es requerido';
    if (!formData.Edad.trim() || isNaN(formData.Edad) || formData.Edad < 0 || formData.Edad > 120) errors.Edad = 'Edad válida requerida (0-120)';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    try {
      const dataToSend = {
        ...formData,
        Telefono: Number(formData.Telefono),
        Edad: Number(formData.Edad),
      };
      const res = await api.post('/users', dataToSend);
      setVerificationCorreo(res.data.correo);
      setShowVerification(true);
      setVerificationSuccess('Se envió un código de verificación a tu correo.');
    } catch (err) {
      setError('Error al registrar. Intenta con otro correo o revisa los datos.');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setVerificationError('');
    setVerificationSuccess('');
    setVerificationLoading(true);
    try {
      await api.post('/users/verificar-correo', {
        correo: verificationCorreo,
        codigo: verificationCode
      });
      setVerificationSuccess('¡Correo verificado! Ahora puedes iniciar sesión.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setVerificationError(err.response?.data?.message || 'Error al verificar el código');
    }
    setVerificationLoading(false);
  };

  if (showVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-teal-100">
        <div className="w-full max-w-sm bg-white/95 p-6 rounded-3xl shadow-xl border border-indigo-100 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center mb-2 w-full">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-100 mb-2 shadow">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-indigo-500">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm0 0v1a4 4 0 01-8 0v-1m8 0V7a4 4 0 00-8 0v5" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-center text-indigo-700 font-sans w-full">Verifica tu correo</h2>
          </div>
          <p className="mb-3 text-center text-gray-600 text-base font-medium w-full">Ingresa el código que recibiste en tu correo electrónico para activar tu cuenta.</p>
          <form onSubmit={handleVerify} className="space-y-3 w-full flex flex-col items-center justify-center">
            <input
              type="text"
              className="w-36 py-2 px-3 text-center text-xl tracking-widest border-2 border-indigo-200 rounded-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-indigo-50 placeholder-gray-400 font-bold shadow-sm transition mb-1"
              placeholder="Código"
              value={verificationCode}
              onChange={e => setVerificationCode(e.target.value)}
              required
              maxLength={5}
              style={{ letterSpacing: 10, fontWeight: 700, fontFamily: 'monospace' }}
            />
            {verificationError && <div className="w-full rounded-full bg-red-100 text-red-700 text-center text-xs font-semibold py-1 px-2 mb-1 shadow">{verificationError}</div>}
            {verificationSuccess && <div className="w-full rounded-full bg-green-100 text-green-700 text-center text-xs font-semibold py-1 px-2 mb-1 shadow">{verificationSuccess}</div>}
            <button
              type="submit"
              className="w-36 py-2 px-3 bg-gradient-to-r from-[#49b6b2] to-[#556f70] hover:from-[#556f70] hover:to-[#49b6b2] text-white text-base font-bold rounded-full shadow-lg transition duration-200 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#49b6b2]/40 animate-pulse hover:animate-none"
              disabled={verificationLoading}
              style={{ boxShadow: '0 2px 12px rgba(73,182,178,0.13)' }}
            >
              {verificationLoading ? 'Verificando...' : 'Verificar correo'}
            </button>
          </form>
          <div className="mt-3 text-center text-gray-500 text-xs font-medium w-full">
            ¿No recibiste el código? <span className="font-semibold">Revisa tu carpeta de spam</span> o espera unos minutos.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: palette.light,
        borderRadius: 18,
        boxShadow: '0 4px 24px rgba(85,111,112,0.10)',
        padding: '2.5rem 2rem',
        maxWidth: 420,
        margin: '0 auto',
      }}
    >
      <h2
        className="mb-4 text-center"
        style={{
          color: palette.primary,
          fontWeight: 700,
          letterSpacing: 1,
        }}
      >
        Registro de Paciente
      </h2>
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label style={{ color: palette.gray, fontWeight: 500 }}>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="Nombre"
            value={formData.Nombre}
            onChange={handleInputChange}
            isInvalid={!!formErrors.Nombre}
            style={{
              borderRadius: 12,
              border: `1.5px solid ${palette.accent}`,
              background: palette.light,
              color: palette.primary,
              fontWeight: 500,
            }}
          />
          <Form.Control.Feedback type="invalid">{formErrors.Nombre}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label style={{ color: palette.gray, fontWeight: 500 }}>Apellido</Form.Label>
          <Form.Control
            type="text"
            name="Apellido"
            value={formData.Apellido}
            onChange={handleInputChange}
            isInvalid={!!formErrors.Apellido}
            style={{
              borderRadius: 12,
              border: `1.5px solid ${palette.accent}`,
              background: palette.light,
              color: palette.primary,
              fontWeight: 500,
            }}
          />
          <Form.Control.Feedback type="invalid">{formErrors.Apellido}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label style={{ color: palette.gray, fontWeight: 500 }}>Tipo de Documento</Form.Label>
          <Form.Select
            name="Tipo_Doc"
            value={formData.Tipo_Doc}
            onChange={handleInputChange}
            isInvalid={!!formErrors.Tipo_Doc}
            style={{
              borderRadius: 12,
              border: `1.5px solid ${palette.accent}`,
              background: palette.light,
              color: palette.primary,
              fontWeight: 500,
            }}
          >
            <option value="">Seleccione...</option>
            {opcionesTipoDoc.map((op) => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{formErrors.Tipo_Doc}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label style={{ color: palette.gray, fontWeight: 500 }}>Documento</Form.Label>
          <Form.Control
            type="text"
            name="Doc_identificacion"
            value={formData.Doc_identificacion}
            onChange={handleInputChange}
            isInvalid={!!formErrors.Doc_identificacion}
            style={{
              borderRadius: 12,
              border: `1.5px solid ${palette.accent}`,
              background: palette.light,
              color: palette.primary,
              fontWeight: 500,
            }}
          />
          <Form.Control.Feedback type="invalid">{formErrors.Doc_identificacion}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label style={{ color: palette.gray, fontWeight: 500 }}>Teléfono</Form.Label>
          <Form.Control
            type="text"
            name="Telefono"
            value={formData.Telefono}
            onChange={handleInputChange}
            isInvalid={!!formErrors.Telefono}
            style={{
              borderRadius: 12,
              border: `1.5px solid ${palette.accent}`,
              background: palette.light,
              color: palette.primary,
              fontWeight: 500,
            }}
          />
          <Form.Control.Feedback type="invalid">{formErrors.Telefono}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label style={{ color: palette.gray, fontWeight: 500 }}>Correo</Form.Label>
          <Form.Control
            type="email"
            name="Correo"
            value={formData.Correo}
            onChange={handleInputChange}
            isInvalid={!!formErrors.Correo}
            style={{
              borderRadius: 12,
              border: `1.5px solid ${palette.accent}`,
              background: palette.light,
              color: palette.primary,
              fontWeight: 500,
            }}
          />
          <Form.Control.Feedback type="invalid">{formErrors.Correo}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label style={{ color: palette.gray, fontWeight: 500 }}>
            Clave <span style={{ fontWeight: 400, color: palette.grayLight }}>(mínimo 8 caracteres)</span>
          </Form.Label>
          <Form.Control
            type="password"
            name="Clave"
            value={formData.Clave}
            onChange={handleInputChange}
            isInvalid={!!formErrors.Clave}
            minLength={8}
            style={{
              borderRadius: 12,
              border: `1.5px solid ${palette.accent}`,
              background: palette.light,
              color: palette.primary,
              fontWeight: 500,
            }}
          />
          <Form.Control.Feedback type="invalid">{formErrors.Clave}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label style={{ color: palette.gray, fontWeight: 500 }}>Género</Form.Label>
          <Form.Select
            name="Genero"
            value={formData.Genero}
            onChange={handleInputChange}
            isInvalid={!!formErrors.Genero}
            style={{
              borderRadius: 12,
              border: `1.5px solid ${palette.accent}`,
              background: palette.light,
              color: palette.primary,
              fontWeight: 500,
            }}
          >
            <option value="">Seleccione...</option>
            {opcionesGenero.map((op) => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{formErrors.Genero}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label style={{ color: palette.gray, fontWeight: 500 }}>Edad</Form.Label>
          <Form.Control
            type="number"
            name="Edad"
            value={formData.Edad}
            onChange={handleInputChange}
            isInvalid={!!formErrors.Edad}
            min={0}
            max={120}
            style={{
              borderRadius: 12,
              border: `1.5px solid ${palette.accent}`,
              background: palette.light,
              color: palette.primary,
              fontWeight: 500,
            }}
          />
          <Form.Control.Feedback type="invalid">{formErrors.Edad}</Form.Control.Feedback>
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          className="w-100"
          style={{
            background: palette.secondary,
            border: 'none',
            borderRadius: 20,
            fontWeight: 600,
            fontSize: 18,
            padding: "0.5rem 0",
            boxShadow: '0 2px 8px rgba(73,182,178,0.10)',
            transition: "background 0.2s"
          }}
        >
          Registrarse
        </Button>
      </Form>
    </div>
  );
};

export default Register;