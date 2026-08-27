import api from "./api";

async function obtenerDisponibilidadesLibres(profesionalId) {
  const params = profesionalId ? { profesionalId } : {};

  const response = await api.get("/disponibilidad/libres", { params });

  return response.data;
}

export {
  obtenerDisponibilidadesLibres,
};