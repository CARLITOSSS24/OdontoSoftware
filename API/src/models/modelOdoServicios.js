import mongoose from "mongoose";

const servSchema = mongoose.Schema({
    Nombre: {
        type: String,
        required: true,
    },
    Descripcion: {
        type: String,
        required: true,
    },
    Disponible: {
        type: String,
        enum: ["Activo", "Inactivo"],
        required: true,
    },
    Precio: {
        type: Number,
        required: true,
    },
    
});

export default mongoose.model("Servicios", servSchema);
