import corsConfig from "./config/corsOdoConfig.js";
import events from "events";
import express from "express";
import dotenv from "dotenv";
import port from "./config/bdD.js";  
import swaggerDocs from "../swagger.js";  
import modelOdoPermisos from "./routes/rutasOdoPermisos.js";
import rutasOdoHistoriales from "./routes/rutasOdoHistoriales.js";
import modelOdoServicios from "./routes/rutasOdoServicios.js";
import modelOdoUsers from "./routes/rutasOdoUser.js";
import modelOdoConsultorio from "./routes/rutasOdoConsultorios.js";
import modelOdoDoctora from "./routes/rutasOdoDoctora.js";
import rutasOdoCitas from "./routes/rutasOdoCitas.js"; 
import rutasOdoLogin from "./routes/rutasOdoLogin.js";
import rutasOdoCargo from './routes/rutasOdoCargo.js';

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
app.use('/api/', rutasOdoCargo);

swaggerDocs(app, port); 

app.get("/", (req, res) => {
  res.send("<h1>ESTA ES LA API</h1>");
});

app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});