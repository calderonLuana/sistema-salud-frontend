// Pasa a minúsculas y quita tildes para que "cardiología" encuentre "Cardiologia"
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// estado: usa el estado visible del turno (RESERVADO, COMPLETADO, CANCELADO, NO_ASISTIO)
// pacienteId: "TODOS" o el id del paciente
function filtrarTurnos(
  turnos,
  { texto = "", estado = "TODOS", pacienteId = "TODOS" } = {}
) {
  const busqueda = normalizar(texto);

  return turnos.filter((turno) => {
    const especialidad = normalizar(
      turno.Disponibilidad?.Profesional?.Especialidad?.nombre || ""
    );

    const coincideTexto = especialidad.includes(busqueda);

    const coincideEstado =
      estado === "TODOS" || turno.estadoVisible === estado;

    const coincidePaciente =
      pacienteId === "TODOS" || String(turno.pacienteId) === String(pacienteId);

    return coincideTexto && coincideEstado && coincidePaciente;
  });
}

export { filtrarTurnos };