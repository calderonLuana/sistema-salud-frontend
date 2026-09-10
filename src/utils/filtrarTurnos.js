function filtrarTurnos(turnos, { texto = "", estado = "TODOS" } = {}) {
  return turnos.filter((turno) => {
    const especialidad =
      turno.Disponibilidad?.Profesional?.Especialidad?.nombre || "";

    const coincideTexto = especialidad
      .toLowerCase()
      .includes(texto.trim().toLowerCase());

    const coincideEstado =
      estado === "TODOS" || turno.estado === estado;

    return coincideTexto && coincideEstado;
  });
}

export { filtrarTurnos };