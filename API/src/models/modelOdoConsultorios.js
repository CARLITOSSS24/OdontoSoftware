import mongoose from "mongoose";

const consultorioSchema = new mongoose.Schema({
    Nombre_consultorio: {
        type: String,
        required: [true, "El nombre del consultorio es obligatorio"],
        unique: true,
        trim: true,
        maxlength: [100, "El nombre del consultorio no puede exceder los 100 caracteres"]
    }
}, {
    timestamps: true
});

export default mongoose.model("Consultorio", consultorioSchema);
