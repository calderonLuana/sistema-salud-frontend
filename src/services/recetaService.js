import api from "./api";

async function obtenerRecetasAfiliado(pacienteId) {
  const response = await api.get(`/recetas/afiliado/${pacienteId}`);

  return response.data;
}

async function obtenerRecetaPorId(recetaId) {
  const response = await api.get(`/recetas/${recetaId}`);

  return response.data;
}

async function crearReceta(datos) {
  const response = await api.post("/recetas", datos);

  return response.data;
}

async function renovarReceta(recetaId, datos) {
  const response = await api.put(`/recetas/renovar/${recetaId}`, datos);

  return response.data;
}

export {
  obtenerRecetasAfiliado,
  obtenerRecetaPorId,
  crearReceta,
  renovarReceta,
};