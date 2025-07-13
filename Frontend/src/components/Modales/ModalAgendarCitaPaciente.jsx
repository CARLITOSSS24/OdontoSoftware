import { Modal, Button, Form, Alert } from 'react-bootstrap';
import api from '../../API/axiosInstance';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ModalAgendarCitaPaciente = ({
  show,
  onHide,
  servicio,
  user,
  doctoras = [],
  consultorios = [],
  onCitaAgendada
}) => {
  const [form, setForm] = useState({
    doctora: '',
    consultorio: '',
    fecha: '',
    hora: '',
    documentoCliente: '',
    nombreCliente: '',
    apellidoCliente: ''
  });
  const [error, setError] = useState(null);
  const [usarDatosUsuario, setUsarDatosUsuario] = useState(false);
  const [loadingDatos, setLoadingDatos] = useState(false);
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [fechaInvalida, setFechaInvalida] = useState(false);
  const [success, setSuccess] = useState(null);

  // Autocompletar datos del usuario si el checkbox está marcado
  useEffect(() => {
    const completarDatos = async () => {
      if (usarDatosUsuario && user) {
        let nombre = user.Nombre || user.nombre || user.nombreCliente || '';
        let apellido = user.Apellido || user.apellido || user.apellidoCliente || '';
        let documento = user.Doc_identificacion || user.doc_identificacion || user.documento || user.documentoCliente || '';
        // Si falta alguno, intenta obtener el usuario completo desde la API
        if ((!apellido || !documento) && (user.id || user._id)) {
          setLoadingDatos(true);
          try {
            const { data } = await api.get(`/users/${user.id || user._id}`);
            nombre = data.Nombre || nombre;
            apellido = data.Apellido || apellido;
            documento = data.Doc_identificacion || documento;
          } catch {
            // Opcional: podrías mostrar un error si lo deseas
          }
          setLoadingDatos(false);
        }
        setForm(f => ({
          ...f,
          documentoCliente: documento,
          nombreCliente: nombre,
          apellidoCliente: apellido
        }));
      }
    };
    completarDatos();
    // eslint-disable-next-line
  }, [usarDatosUsuario, user]);

  // Filtrar doctoras según el servicio seleccionado
  const esOrtodoncia = servicio && (servicio.Nombre === 'Ortodoncia' || servicio.nombre === 'Ortodoncia');
  let doctorasFiltradas = doctoras.filter(doc => {
    const cargoNombre = (doc.cargo?.nombre || '').toLowerCase();
    if (esOrtodoncia) {
      return cargoNombre.includes('ortodoncista') || cargoNombre.includes('ortodoncia');
    } else {
      return cargoNombre.includes('odontóloga') || cargoNombre.includes('odontologa') || cargoNombre.includes('doctora') || cargoNombre.includes('doctor');
    }
  });
  // Si el filtro no encontró ninguna, mostrar todas
  if (doctorasFiltradas.length === 0) {
    doctorasFiltradas = doctoras;
  }
  // LOG para depuración de doctorasFiltradas
  console.log('doctorasFiltradas:', doctorasFiltradas);
  // LOG para depuración de form.doctora
  console.log('form.doctora:', form.doctora);

  // Filtrar consultorios según la doctora seleccionada
  const consultoriosFiltrados = doctoras.length && form.doctora
    ? consultorios.filter(c => c._id === (doctoras.find(d => d._id === form.doctora)?.Id_consultorio?._id || doctoras.find(d => d._id === form.doctora)?.Id_consultorio))
    : [];

  useEffect(() => {
    // Si cambia la doctora, autoselecciona el consultorio correspondiente
    if (form.doctora) {
      const doc = doctoras.find(d => d._id === form.doctora);
      if (doc && doc.Id_consultorio) {
        setForm(f => ({ ...f, consultorio: doc.Id_consultorio?._id || doc.Id_consultorio }));
      }
    }
  }, [form.doctora, doctoras]);

  // Calcular horas disponibles según el servicio y el día seleccionado
  useEffect(() => {
    if (!form.fecha) {
      setHorasDisponibles([]);
      setFechaInvalida(false);
      return;
    }
    const fechaObj = new Date(form.fecha + 'T00:00:00-05:00'); // Bogotá timezone
    const day = fechaObj.getUTCDay(); // 0=domingo, 4=jueves
    let horas = [];
    if (esOrtodoncia) {
      if (day !== 4) {
        setHorasDisponibles([]);
        setFechaInvalida(true);
        return;
      }
      setFechaInvalida(false);
      for (let h = 13; h <= 19; h++) {
        for (let m of [0, 20, 40]) {
          if (h === 19 && m > 0) continue;
          const horaStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
          horas.push(horaStr);
        }
      }
    } else {
      setFechaInvalida(false);
      if (day === 0) {
        setHorasDisponibles([]);
        return;
      }
      if (day >= 1 && day <= 5) {
        for (let h = 12; h <= 17; h++) {
          for (let m of [0, 40]) {
            if (h === 17 && m !== 0) continue;
            const horaStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            horas.push(horaStr);
          }
        }
      }
      if (day === 6) {
        for (let h = 12; h <= 15; h++) {
          if (h === 15) {
            horas.push('15:00');
          } else {
            horas.push(`${h.toString().padStart(2, '0')}:00`);
          }
        }
      }
    }
    // Filtrar horas ocupadas
    const fetchHorasOcupadas = async () => {
      try {
        const fechaISO = fechaObj.toISOString().split('T')[0];
        const res = await api.get('/citas');
        const ocupadas = (res.data.data || res.data || []).filter(cita => {
          return (
            (cita.servicios?._id === servicio._id || cita.servicios === servicio._id) &&
            cita.fecha && cita.fecha.split('T')[0] === fechaISO
          );
        }).map(cita => cita.hora);
        setHorasDisponibles(horas.filter(h => !ocupadas.includes(h)));
      } catch {
        setHorasDisponibles(horas);
      }
    };
    fetchHorasOcupadas();
    // eslint-disable-next-line
  }, [servicio, form.fecha]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!form.doctora || !form.consultorio || !form.fecha || !form.hora || !form.documentoCliente || !form.nombreCliente || !form.apellidoCliente) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    // LOG para depuración del payload
    const payload = {
      servicios: servicio._id,
      doctora: form.doctora,
      consultorio: form.consultorio,
      fecha: form.fecha,
      hora: form.hora,
      documentoCliente: form.documentoCliente,
      nombreCliente: form.nombreCliente,
      apellidoCliente: form.apellidoCliente
    };
    console.log('Payload enviado al backend:', payload);
    try {
      const res = await api.post('/citas', payload);
      if (res.status === 201) {
        setError(null); // Limpia cualquier error anterior
        setSuccess('¡Cita agendada exitosamente!');
        setTimeout(() => {
          setSuccess(null);
          setForm({
            doctora: '',
            consultorio: '',
            fecha: '',
            hora: '',
            documentoCliente: '',
            nombreCliente: '',
            apellidoCliente: ''
          });
          onCitaAgendada();
          onHide();
        }, 2000);
      } else {
        setError(res.data?.message || 'Error inesperado al agendar la cita');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al agendar la cita';
      setError(msg);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Agendar Cita - {servicio?.Nombre}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Recoger mis datos"
              checked={usarDatosUsuario}
              onChange={e => setUsarDatosUsuario(e.target.checked)}
              disabled={loadingDatos}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Documento</Form.Label>
            <Form.Control
              type="text"
              name="documentoCliente"
              value={form.documentoCliente}
              onChange={handleChange}
              required
              disabled={usarDatosUsuario || loadingDatos}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombreCliente"
              value={form.nombreCliente}
              onChange={handleChange}
              required
              disabled={usarDatosUsuario || loadingDatos}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              name="apellidoCliente"
              value={form.apellidoCliente}
              onChange={handleChange}
              required
              disabled={usarDatosUsuario || loadingDatos}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Doctora</Form.Label>
            <Form.Select name="doctora" value={form.doctora} onChange={handleChange} required>
              <option value="">Seleccione una doctora</option>
              {doctorasFiltradas.map(doc => (
                <option key={doc._id} value={doc._id}>{doc.Nombres} {doc.Apellidos}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Consultorio</Form.Label>
            <Form.Select name="consultorio" value={form.consultorio} required disabled>
              <option value="">Seleccione un consultorio</option>
              {consultoriosFiltrados.map(c => (
                <option key={c._id} value={c._id}>{c.Nombre_consultorio}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              required
              min={(() => {
                const today = new Date();
                return today.toISOString().split('T')[0];
              })()}
              pattern={esOrtodoncia ? "[0-9]{4}-[0-9]{2}-[0-9]{2}" : undefined}
              onInput={e => {
                if (esOrtodoncia) {
                  const d = new Date(e.target.value + 'T00:00:00-05:00');
                  const day = d.getUTCDay();
                  if (day !== 4) {
                    e.target.setCustomValidity('Solo puedes seleccionar jueves para ortodoncia');
                  } else {
                    e.target.setCustomValidity('');
                  }
                }
              }}
              disabled={esOrtodoncia ? false : undefined}
            />
            {fechaInvalida && esOrtodoncia && (
              <div style={{ color: '#d9534f', fontSize: 14, marginTop: 4 }}>
                Solo puedes seleccionar jueves para ortodoncia.
              </div>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Hora</Form.Label>
            <Form.Select name="hora" value={form.hora} onChange={handleChange} required disabled={horasDisponibles.length === 0}>
              <option value="">Seleccione una hora</option>
              {horasDisponibles.map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancelar</Button>
          <Button type="submit" variant="primary" disabled={loadingDatos}>Agendar</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

ModalAgendarCitaPaciente.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  servicio: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  doctoras: PropTypes.array,
  consultorios: PropTypes.array,
  onCitaAgendada: PropTypes.func.isRequired
};

export default ModalAgendarCitaPaciente; 