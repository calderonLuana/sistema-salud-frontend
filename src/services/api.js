import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

//para que se agregue el token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

//si el token venció o es inválido, se cierra la sesión y se vuelve al login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const esLogin = error.config?.url?.includes("/afiliados/login");
    const habiaSesion = localStorage.getItem("token");

    if (error.response?.status === 401 && !esLogin && habiaSesion) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");

      sessionStorage.setItem(
        "mensajeSesion",
        "Tu sesión expiró. Volvé a ingresar."
      );

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;