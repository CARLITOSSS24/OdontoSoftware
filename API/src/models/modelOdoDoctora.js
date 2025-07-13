import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const doctoraSchema = new mongoose.Schema({
    Nombres: {
        type: String,
        required: [true, "El nombre es obligatorio"],
        trim: true,
        maxlength: [50, "El nombre no puede exceder los 50 caracteres"]
    },
    Apellidos: {
        type: String,
        required: [true, "El apellido es obligatorio"],
        trim: true,
        maxlength: [50, "El apellido no puede exceder los 50 caracteres"]
    },
    Tipo_Doc: {
        type: String,
        required: [true, 'El tipo de documento es obligatorio'],
        enum: {
            values: [
                'RC', // Registro Civil de Nacimiento
                'TI', // Tarjeta de Identidad
                'CC', // Cédula de Ciudadanía
                'TE', // Tarjeta de Extranjería
                'CE', // Cédula de Extranjería
                'NIT', // Número de Identificación Tributaria
                'PP', // Pasaporte
                'PEP', // Permiso Especial de Permanencia
                'DIE', // Documento de Identificación Extranjero
                'PA'
            ],
            message: 'El tipo de documento debe ser uno de los siguientes valores: RC, TI, CC, TE, CE, NIT, PP, PEP, DIE, PA',
        },
    },
    Doc_identificacion: {
        type: String,
        required: [true, "El documento de identificación es obligatorio"],
        unique: true,
        trim: true,
    },
    Telefono: {
        type: Number,
        required: [true, 'El número de teléfono es obligatorio'],
    },
    Correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'El correo no tiene un formato válido',
        ],
    },  
    Permiso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permiso",
        required: true,
    },
    Clave: {
        type: String,
        required: [true, 'La clave es obligatoria'],
        minlength: [6, 'La clave debe tener al menos 6 caracteres']
    },
    Genero: {
        type: String,
        required: [true, 'El género es obligatorio'],
        enum: {
            values: ['Masculino', 'Femenino', 'Otro'],
            message: 'El género debe ser Masculino, Femenino u Otro',
        },
    },
    Edad: {
        type: Number,
        required: [true, 'La edad es obligatoria'],
        min: [0, 'La edad no puede ser negativa'],
        max: [120, 'La edad no puede ser mayor a 120'],
    },
    Id_consultorio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Consultorio",
        required: [true, "El ID del consultorio es obligatorio"]
    },
    cargo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cargo",
        required: [true, "El cargo es obligatorio"]
    }
}, {
    timestamps: true
});


export default mongoose.model("Doctora", doctoraSchema);
