import api from "./api";

async function obtenerTurnosProximos(pacienteId) {
  const response = await api.get(`/turnos/proximos/${pacienteId}`);

  return response.data;
}

async function obtenerTurnosAnteriores(pacienteId) {
  const response = await api.get(`/turnos/historial/${pacienteId}`);

  return response.data;
}

export {
  obtenerTurnosProximos,
  obtenerTurnosAnteriores
};