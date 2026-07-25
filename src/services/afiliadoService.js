import api from "./api";

async function login(datos) {
  const response = await api.post("/afiliados/login", datos);

  return response.data;
}

async function registro(datos) {
  const response = await api.post("/afiliados/registro", datos);

  return response.data;
}

export { login, registro };