import CitaSchema from "../models/modelOdoCitas.js";
import Doctora from "../models/modelOdoDoctora.js";
import Servicios from "../models/modelOdoServicios.js";
import moment from 'moment';
import { ReporteCita } from '../models/modelOdoCitas.js';
import cron from 'node-cron';

export const createCita = async (req, resp) => {
  try {
    const { servicios, doctora, fecha, hora } = req.body;
    // Verificar duplicidad de cita para el mismo servicio, fecha y hora y doctora
    const existe = await CitaSchema.findOne({ servicios, fecha, hora, doctora });
    if (existe) {
      return resp.status(409).json({ message: "Ya existe una cita para ese servicio, fecha, hora y doctora." });
    }
    console.log("Payload recibido:", req.body);
    const doc = await Doctora.findById(doctora).populate('cargo');
    const serv = await Servicios.findById(servicios);
    console.log("Doctora encontrada:", doc);
    console.log("Servicio encontrado:", serv);
    if (!doc) {
      return resp.status(400).json({ message: "Doctora no válida o no encontrada." });
    }
    if (!serv) {
      return resp.status(400).json({ message: "Servicio no válido o no encontrado." });
    }
    // Asegura que cargo y nombreServicio sean strings
    const cargo = doc?.cargo?.nombre ? doc.cargo.nombre.toLowerCase() : "";
    const nombreServicio = serv?.Nombre ? serv.Nombre.toLowerCase() : "";
    const fechaMoment = moment(fecha);
    const day = fechaMoment.day(); // 0=domingo, 6=sábado
    const [horaStr, minStr] = hora.split(":");
    const horaNum = parseInt(horaStr, 10);
    // ORTODONCIA
    if (nombreServicio.includes("ortodoncia")) {
      if (!cargo.includes("ortodoncia")) {
        return resp.status(400).json({ message: "Error de especialidad: Solo la doctora con especialidad en ortodoncia puede atender citas de ortodoncia." });
      }
      if (!cargo.includes("ortodoncista") && !cargo.includes("ortodoncia")) {
        return resp.status(400).json({ message: "Error de especialidad: Solo la doctora ortodoncista puede atender ortodoncia." });
      }
      if (day !== 4) {
        return resp.status(400).json({ message: "Las citas de ortodoncia solo se atienden los jueves." });
      }
      const minutosValidos = ["00", "20", "40"];
      if (horaNum < 13 || horaNum > 19 || (horaNum === 19 && minStr !== "00")) {
        return resp.status(400).json({ message: "Horario de ortodoncia: jueves de 13:00 a 19:00." });
      }
      if (!minutosValidos.includes(minStr)) {
        return resp.status(400).json({ message: "Intervalos de ortodoncia: cada 20 minutos (00, 20, 40)." });
      }
    } else {
      // ODONTÓLOGA GENERAL
      if (cargo.includes("ortodoncia") || cargo.includes("ortodoncista")) {
        return resp.status(400).json({ message: "Error de especialidad: La doctora de ortodoncia solo puede atender citas de ortodoncia." });
      }
      if (!cargo.includes("odontóloga") && !cargo.includes("odontologa")) {
        return resp.status(400).json({ message: "Error de especialidad: Solo la odontóloga general puede atender este servicio." });
      }
      if (nombreServicio.includes("ortodoncia")) {
        return resp.status(400).json({ message: "Error de especialidad: La odontóloga general no puede atender ortodoncia." });
      }
      if (day === 0) {
        return resp.status(400).json({ message: "No se atienden citas los domingos." });
      }
      // Lunes a viernes
      if (day >= 1 && day <= 5) {
        if (horaNum < 12 || horaNum > 17 || (horaNum === 17 && minStr !== "00")) {
          return resp.status(400).json({ message: "Horario de odontología general: lun-sáb 12:00 a 17:00 (sábados hasta 15:00)." });
        }
        // Intervalos de 40 min o 1h
        const minutosValidos = ["00", "40"];
        if (!minutosValidos.includes(minStr)) {
          return resp.status(400).json({ message: "Intervalos válidos: cada 40 minutos o 1 hora (00, 40)." });
        }
      }
      // Sábado
      if (day === 6) {
        if (horaNum < 12 || horaNum > 15 || (horaNum === 15 && minStr !== "00")) {
          return resp.status(400).json({ message: "Horario de odontología general: sábados 12:00 a 15:00." });
        }
        // Solo 1h permitido
        if (minStr !== "00") {
          return resp.status(400).json({ message: "Los sábados solo se permiten intervalos de 1 hora (00)." });
        }
      }
    }
    // Crear la cita ignorando el campo cargo del frontend
    const cita = new CitaSchema({ ...req.body, cargo: undefined });
    const data = await cita.save();
    resp.status(201).json({ message: "Cita creada exitosamente", data });
  } catch (error) {
    resp.status(500).json({ message: "Error al crear la cita", error: error.message });
  }
};

export const getCitas = async (req, resp) => {
  try {
    const { doctoraId } = req.query; // Obtener el ID de la doctora de los query params
    
    let query = {};
    if (doctoraId) {
      query.doctora = doctoraId;
    }

    const data = await CitaSchema.find(query)
      .populate("servicios", "Nombre")
      .populate({
        path: "doctora",
        select: "Nombres Apellidos cargo",
        populate: {
          path: "cargo",
          select: "nombre"
        }
      })
      .populate("consultorio", "Nombre_consultorio")
      .sort({ fecha: 1, hora: 1 }); // Ordenar por fecha y hora
    
    resp.status(200).json({ message: "Citas obtenidas exitosamente", data });
  } catch (error) {
    resp.status(500).json({ message: "Error al obtener las citas", error: error.message });
  }
};

export const getCitaById = async (req, resp) => {
  const { _id } = req.params;
  try {
    const data = await CitaSchema.findOne({ _id })
      .populate("servicios", "nombre")
      .populate("doctora", "nombre apellido")
      .populate("consultorio", "nombre ubicacion");
    if (data) {
      resp.status(200).json({ message: "Cita encontrada", data });
    } else {
      resp.status(404).json({ message: "Cita no encontrada" });
    }
  } catch (error) {
    resp.status(500).json({ message: "Error al obtener la cita", error: error.message });
  }
};

export const updateCita = async (req, resp) => {
  const { _id } = req.params;
  const { documentoCliente, nombreCliente, apellidoCliente, servicios, doctora, consultorio, fecha, hora } = req.body;

  try {
    const data = await CitaSchema.updateOne(
      { _id },
      { $set: { documentoCliente, nombreCliente, apellidoCliente, servicios, doctora, consultorio, fecha, hora } }
    );

    if (data.matchedCount === 0) {
      resp.status(404).json({ message: `No se encontró una cita con el ID ${_id}.` });
    } else if (data.modifiedCount === 0) {
      resp.status(200).json({ message: "La cita ya estaba actualizada. No se realizaron cambios." });
    } else {
      resp.status(200).json({ message: "Cita actualizada exitosamente." });
    }
  } catch (error) {
    resp.status(500).json({
      message: "Ocurrió un error al actualizar la cita.",
      error: error.message,
    });
  }
};

export const deleteCita = async (req, resp) => {
  const { _id } = req.params;
  try {
    const data = await CitaSchema.deleteOne({ _id });
    if (data.deletedCount > 0) {
      resp.status(200).json({ message: "Cita eliminada exitosamente" });
    } else {
      resp.status(404).json({ message: "Cita no encontrada" });
    }
  } catch (error) {
    resp.status(500).json({ message: "Error al eliminar la cita", error: error.message });
  }
};

export const confirmarAsistencia = async (req, resp) => {
  const { _id } = req.params;
  try {
    const cita = await CitaSchema.findById(_id);
    if (!cita) {
      return resp.status(404).json({ message: 'Cita no encontrada' });
    }
    cita.estado = 'Terminado';
    await cita.save();
    // Guardar en ReporteCita
    await ReporteCita.create({
      documentoCliente: cita.documentoCliente,
      nombreCliente: cita.nombreCliente,
      apellidoCliente: cita.apellidoCliente,
      servicios: cita.servicios,
      doctora: cita.doctora,
      consultorio: cita.consultorio,
      fecha: cita.fecha,
      hora: cita.hora,
      estado: cita.estado,
      fechaConfirmacion: new Date(),
    });
    resp.status(200).json({ message: '¡Asistencia confirmada! La cita será eliminada automáticamente en una semana y se ha guardado en el historial de reportes.', data: cita });
  } catch (error) {
    resp.status(500).json({ message: 'Error al confirmar la asistencia', error: error.message });
  }
};

// Eliminación semanal de citas terminadas (más de 7 días)
export const eliminarCitasTerminadasAntiguas = async () => {
  const unaSemanaAntes = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  try {
    const result = await CitaSchema.deleteMany({ estado: 'Terminado', fecha: { $lte: unaSemanaAntes } });
    console.log(`Citas terminadas eliminadas: ${result.deletedCount}`);
  } catch (error) {
    console.error('Error al eliminar citas terminadas:', error.message);
  }
};

// Programar el cron job para eliminar citas terminadas semanalmente (domingo 2:00 AM)
cron.schedule('0 2 * * 0', () => {
  eliminarCitasTerminadasAntiguas();
  console.log('Cron job ejecutado: Eliminación semanal de citas terminadas.');
});