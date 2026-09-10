import api from "./api";

async function listarMedicamentos() {
  const response = await api.get("/medicamento");

  return response.data;
}

export {
  listarMedicamentos,
};