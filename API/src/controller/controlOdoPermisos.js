import permisosSchema from "../models/modelOdoPermisos.js";

export const createPermiso = async (req, res) => {
    try {
        const permiso = new permisosSchema(req.body);
        const data = await permiso.save();
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ message: `Error al crear permiso: ${error.message}` });
    }
};

export const getPermisos = async (req, res) => {
    try {
        const data = await permisosSchema.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: `Error al obtener permisos: ${error.message}` });
    }
};

export const getPermisoById = async (req, res) => {
    const { _id } = req.params;
    try {
        const permiso = await permisosSchema.findById(_id);
        if (!permiso) {
            return res.status(404).json({ message: "Permiso no encontrado" });
        }
        res.status(200).json(permiso);
    } catch (error) {
        res.status(500).json({ message: `Error al obtener permiso: ${error.message}` });
    }
};

export const updatePermiso = async (req, res) => {
    const { _id } = req.params;
    const { rol } = req.body;
    try {
        const permisoUpdate = await permisosSchema.findByIdAndUpdate(
            _id,
            { rol },
            { new: true, runValidators: true }
        );
        if (!permisoUpdate) {
            return res.status(404).json({ message: "Permiso no encontrado" });
        }
        res.status(200).json({ message: "Permiso actualizado correctamente", data: permisoUpdate });
    } catch (error) {
        res.status(500).json({ message: `Error al actualizar permiso: ${error.message}` });
    }
};

export const deletePermiso = async (req, res) => {
    const { _id } = req.params;
    try {
        const result = await permisosSchema.findByIdAndDelete(_id);
        if (!result) {
            return res.status(404).json({ message: "Permiso no encontrado" });
        }
        res.status(200).json({ message: "Permiso eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: `Error al eliminar permiso: ${error.message}` });
    }
};