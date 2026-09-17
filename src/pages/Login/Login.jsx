import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login as loginService } from "../../services/afiliadoService";
import { AuthContext } from "../../context/AuthContext";
import styles from "./Login.module.css";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [errorLogin, setErrorLogin] = useState("");

  async function onSubmit(data) {
    setErrorLogin("");

    try {
      const respuesta = await loginService(data);

      login(
        respuesta.afiliado,
        respuesta.token
      );

      navigate("/inicio");
    } catch (error) {
      if (error.response) {
        setErrorLogin(error.response.data.error);
      } else {
        setErrorLogin("Ocurrió un error inesperado.");
      }
    }
  }

  return (
    <div className={styles.pantalla}>

      <div className={styles.panelImagen}>
        <div className={styles.overlay}>
          <div className={styles.logo}>
            <svg
              className={styles.logoIcono}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="2"
                y="4"
                width="16"
                height="12"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M7 20h6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M10 16v4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <circle
                cx="19"
                cy="16"
                r="4.2"
                fill="currentColor"
                stroke="#7c6fe0"
                strokeWidth="1"
              />
              <path
                d="M19 14v4M17 16h4"
                stroke="#7c6fe0"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <span className={styles.logoTexto}>LAV</span>
          </div>

          <h1 className={styles.tituloImagen}>Bienvenido/a</h1>
          <p className={styles.subtituloImagen}>Ingresá a tu cuenta</p>
        </div>
      </div>

      <div className={styles.panelFormulario}>
        <div className={styles.contenedorFormulario}>

          <h2 className={styles.tituloFormMobile}>Bienvenido/a</h2>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.formulario} noValidate>
            <label className={styles.label}>
              DNI
              <input
                type="text"
                placeholder="Ej: 12345678"
                className={styles.input}
                {...register("dni", { required: "El DNI es obligatorio." })}
              />
              {errors.dni && (
                <span className={styles.errorCampo}>{errors.dni.message}</span>
              )}
            </label>

            <label className={styles.label}>
              Contraseña
              <input
                type="password"
                placeholder="••••••••"
                className={styles.input}
                {...register("password", { required: "La contraseña es obligatoria." })}
              />
              {errors.password && (
                <span className={styles.errorCampo}>{errors.password.message}</span>
              )}
            </label>

            <Link to="/recuperar" className={styles.linkOlvide}>
              ¿Olvidaste tu contraseña?
            </Link>

            <button type="submit" className={styles.botonIngresar}>
              Ingresar
            </button>

            {errorLogin && (
              <p className={styles.error}>{errorLogin}</p>
            )}
          </form>

          <div className={styles.separador}></div>

          <p className={styles.textoRegistro}>
            ¿No tenés cuenta?{" "}
            <Link to="/registro" className={styles.linkRegistro}>
              Registrate
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
}

export default Login;