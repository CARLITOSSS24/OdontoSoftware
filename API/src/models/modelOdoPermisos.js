import mongoose from "mongoose";

const permisosSchema = mongoose.Schema(
  {
    rol: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

const Permiso = mongoose.model("Permiso", permisosSchema);

export default Permiso;
