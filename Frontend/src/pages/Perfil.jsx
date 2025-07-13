import { useState, useEffect, useContext } from "react";
import { Container, Form, Button, Row, Col, Alert, Spinner } from "react-bootstrap";
import { AuthContext } from "../contexts/AuthContext";
import api from "../API/axiosInstance";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer";

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

const Perfil = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    Nombre: "",
    Apellido: "",
    Tipo_Doc: "",
    Doc_identificacion: "",
    Telefono: "",
    Correo: "",
    Genero: "",
    Edad: "",
  });
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user === null) {
      setLoading(false);
      setError("No hay usuario autenticado.");
      return;
    }
    if (user === undefined) {
      setTimeout(() => {
        setLoading(false);
        setError("No se pudo obtener el usuario.");
      }, 2000);
      return;
    }
    if (!user || !(user._id || user.id)) return;

    const fetchData = async () => {
      try {
        const res = await api.get(`/users/${user._id || user.id}`);
        setFormData({
          Nombre: res.data.Nombre || "",
          Apellido: res.data.Apellido || "",
          Tipo_Doc: res.data.Tipo_Doc || "",
          Doc_identificacion: res.data.Doc_identificacion || "",
          Telefono: res.data.Telefono || "",
          Correo: res.data.Correo || "",
          Genero: res.data.Genero || "",
          Edad: res.data.Edad || "",
        });
      } catch (err) {
        setError("No se pudieron cargar los datos.");
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    try {
      await api.patch(`/users/${user._id || user.id}`, {
        Nombre: formData.Nombre,
        Apellido: formData.Apellido,
        Tipo_Doc: formData.Tipo_Doc,
        Doc_identificacion: formData.Doc_identificacion,
        Permiso: "6820f7c214cd039b43a1f66c",
        Edad: formData.Edad,
      });
      setMensaje("Datos actualizados correctamente.");
    } catch (err) {
      setError("Error al actualizar los datos.");
      console.error("Error PATCH:", err?.response?.data || err);
    }
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <Container className="mt-5 text-center">
          <Spinner animation="border" />
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div style={{
        minHeight: "100vh",
        background: "#eef6f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <Container
          style={{
            maxWidth: 480,
            background: "#fff",
            borderRadius: 24,
            padding: 36,
            boxShadow: "0 8px 32px 0 rgba(73,182,178,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.04)",
            marginTop: 40,
            border: "2px solid #95bfbd"
          }}
        >
          <h2
            className="text-center mb-4"
            style={{
              fontWeight: 800,
              color: "#556f70",
              letterSpacing: "1px",
              fontSize: "2.2rem"
            }}
          >
            Mi Perfil
          </h2>
          {mensaje && <Alert variant="success">{mensaje}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: "#556f70", fontWeight: 600 }}>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="Nombre"
                value={formData.Nombre}
                onChange={handleChange}
                required
                style={{
                  background: "#eef6f6",
                  border: "1.5px solid #95bfbd",
                  borderRadius: 10,
                  color: "#556f70"
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: "#556f70", fontWeight: 600 }}>Apellido</Form.Label>
              <Form.Control
                type="text"
                name="Apellido"
                value={formData.Apellido}
                onChange={handleChange}
                required
                style={{
                  background: "#eef6f6",
                  border: "1.5px solid #95bfbd",
                  borderRadius: 10,
                  color: "#556f70"
                }}
              />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#556f70", fontWeight: 600 }}>Tipo de documento</Form.Label>
                  <Form.Select
                    name="Tipo_Doc"
                    value={formData.Tipo_Doc}
                    onChange={handleChange}
                    required
                    style={{
                      background: "#eef6f6",
                      border: "1.5px solid #95bfbd",
                      borderRadius: 10,
                      color: "#556f70"
                    }}
                  >
                    <option value="">Seleccione...</option>
                    {opcionesTipoDoc.map((op) => (
                      <option key={op.value} value={op.value}>{op.label}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#556f70", fontWeight: 600 }}>Documento</Form.Label>
                  <Form.Control
                    type="text"
                    name="Doc_identificacion"
                    value={formData.Doc_identificacion}
                    onChange={handleChange}
                    required
                    style={{
                      background: "#eef6f6",
                      border: "1.5px solid #95bfbd",
                      borderRadius: 10,
                      color: "#556f70"
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: "#556f70", fontWeight: 600 }}>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="Telefono"
                value={formData.Telefono}
                disabled
                readOnly
                style={{
                  background: "#8c9694",
                  border: "1.5px solid #95bfbd",
                  borderRadius: 10,
                  color: "#7d7e7d"
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: "#556f70", fontWeight: 600 }}>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                name="Correo"
                value={formData.Correo}
                disabled
                readOnly
                style={{
                  background: "#8c9694",
                  border: "1.5px solid #95bfbd",
                  borderRadius: 10,
                  color: "#7d7e7d"
                }}
              />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#556f70", fontWeight: 600 }}>Edad</Form.Label>
                  <Form.Control
                    type="number"
                    name="Edad"
                    value={formData.Edad}
                    onChange={handleChange}
                    min={0}
                    max={120}
                    required
                    style={{
                      background: "#eef6f6",
                      border: "1.5px solid #95bfbd",
                      borderRadius: 10,
                      color: "#556f70"
                    }}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#556f70", fontWeight: 600 }}>Género</Form.Label>
                  <Form.Select
                    name="Genero"
                    value={formData.Genero}
                    disabled
                    readOnly
                    style={{
                      background: "#8c9694",
                      border: "1.5px solid #95bfbd",
                      borderRadius: 10,
                      color: "#7d7e7d"
                    }}
                  >
                    <option value="">Seleccione...</option>
                    {opcionesGenero.map((op) => (
                      <option key={op.value} value={op.value}>{op.label}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Button
              type="submit"
              style={{
                width: "100%",
                fontWeight: 700,
                background: "linear-gradient(90deg, #49b6b2 0%, #95bfbd 100%)",
                border: "none",
                borderRadius: 12,
                fontSize: "1.1rem",
                color: "#fff",
                boxShadow: "0 2px 8px 0 rgba(73,182,178,0.10)"
              }}
            >
              Guardar cambios
            </Button>
          </Form>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Perfil;