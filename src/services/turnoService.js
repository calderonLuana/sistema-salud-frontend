import api from "./api";

async function obtenerTurnosProximos(pacienteId) {
  const response = await api.get(`/turnos/proximos/${pacienteId}`);

  return response.data;
}

async function obtenerTurnosAnteriores(pacienteId) {
  const response = await api.get(`/turnos/historial/${pacienteId}`);

  return response.data;
}

async function obtenerTurnoPorId(turnoId) {
  const response = await api.get(`/turnos/${turnoId}`);

  return response.data;
}

async function cancelarTurno(turnoId) {
  const response = await api.delete(`/turnos/${turnoId}`);

  return response.data;
}

async function crearTurno(pacienteId, disponibilidadId) {
  const response = await api.post("/turnos", {
    pacienteId,
    disponibilidadId,
  });

  return response.data;
}

async function editarTurno(turnoId, { pacienteId, nuevaDisponibilidadId }) {
  const response = await api.patch(`/turnos/${turnoId}`, {
    pacienteId,
    nuevaDisponibilidadId,
  });

  return response.data;
}

export {
  obtenerTurnosProximos,
  obtenerTurnosAnteriores,
  obtenerTurnoPorId,
  cancelarTurno,
  crearTurno,
  editarTurno,
};