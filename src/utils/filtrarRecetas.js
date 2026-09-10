function filtrarRecetas(recetas, { texto = "", estado = "TODOS" } = {}) {
  return recetas.filter((receta) => {
    const nombreMedicamento = receta.medicamento?.nombre || "";

    const coincideTexto = nombreMedicamento
      .toLowerCase()
      .includes(texto.trim().toLowerCase());

    const coincideEstado =
      estado === "TODOS" || receta.estado === estado;

    return coincideTexto && coincideEstado;
  });
}

export { filtrarRecetas };