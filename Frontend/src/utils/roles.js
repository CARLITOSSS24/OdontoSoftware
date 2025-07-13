// Jerarquía de roles de menor a mayor privilegio
const rolesHierarchy = ["PACIENTE", "RECEPCIONISTA", "DOCTORA", "ADMIN"];

/**
 * Verifica si el usuario tiene permiso para acceder a la ruta según la jerarquía.
 * @param {string} userRol - El rol del usuario autenticado.
 * @param {string} rutaRol - El rol mínimo requerido para la ruta.
 * @returns {boolean} true si tiene permiso, false si no.
 */
export function tienePermiso(userRol, rutaRol) {
  const userIndex = rolesHierarchy.indexOf(userRol);
  const rutaIndex = rolesHierarchy.indexOf(rutaRol);
  return userIndex >= 0 && rutaIndex >= 0 && userIndex >= rutaIndex;
}