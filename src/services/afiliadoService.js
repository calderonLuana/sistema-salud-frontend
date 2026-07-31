import api from "./api";

async function login(datos) {
  const response = await api.post("/afiliados/login", datos);

  return response.data;
}

async function registro(datos) {
  const response = await api.post("/afiliados/registro", datos);

  return response.data;
}

async function obtenerAfiliado(id) {
  const response = await api.get(`/afiliados/${id}`);

  return response.data;
}

async function obtenerGrupoFamiliar(id) {
  const response = await api.get(`/afiliados/grupo/${id}`);

  return response.data;
}

export {
  login,
  registro,
  obtenerAfiliado,
  obtenerGrupoFamiliar
};