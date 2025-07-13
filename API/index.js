import corsConfig from "./src/config/corsOdoConfig.js";
import events from "events";
import express from "express";
import dotenv from "dotenv";
import port from "./src/config/bdD.js";  
import swaggerDocs from "./swagger.js";  
import modelOdoPermisos from "./src/routes/rutasOdoPermisos.js";
import rutasOdoHistoriales from "./src/routes/rutasOdoHistoriales.js";
import modelOdoServicios from "./src/routes/rutasOdoServicios.js";
import modelOdoUsers from "./src/routes/rutasOdoUser.js";
import modelOdoConsultorio from "./src/routes/rutasOdoConsultorios.js";
import modelOdoDoctora from "./src/routes/rutasOdoDoctora.js";
import rutasOdoCitas from "./src/routes/rutasOdoCitas.js"; 
import rutasOdoLogin from "./src/routes/rutasOdoLogin.js";
import rutasOdoPassword from "./src/routes/rutasOdoPassword.js";

events.setMaxListeners(20);

dotenv.config();

const app = express();

app.use(corsConfig);

app.use(express.json());

// Registro de rutas
app.use('/api/', modelOdoPermisos);
app.use('/api/', rutasOdoHistoriales);
app.use('/api/', modelOdoServicios);
app.use('/api/', modelOdoUsers);
app.use('/api/', modelOdoConsultorio);
app.use('/api/', modelOdoDoctora);
app.use('/api/', rutasOdoCitas);
app.use('/api/', rutasOdoLogin);
app.use('/api/', rutasOdoPassword);

swaggerDocs(app, port); 

app.get("/", (req, res) => {
  res.send("<h1>ESTA ES LA API</h1>");
});

app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});