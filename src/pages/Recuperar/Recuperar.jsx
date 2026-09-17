import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { recuperarPassword } from "../../services/afiliadoService";
import styles from "./Recuperar.module.css";

function Recuperar() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [errorRecuperar, setErrorRecuperar] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);

  async function onSubmit(data) {
    setErrorRecuperar("");

    if (data.password !== data.confirmarPassword) {
      setErrorRecuperar("Las contraseñas no coinciden.");
      return;
    }

    try {
      setEnviando(true);

      await recuperarPassword(data);

      setExito(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      if (error.response) {
        setErrorRecuperar(error.response.data.error);
      } else {
        setErrorRecuperar("Ocurrió un error inesperado.");
      }
    } finally {
      setEnviando(false);
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

          <h1 className={styles.tituloImagen}>Recuperar acceso</h1>
          <p className={styles.subtituloImagen}>
            Definí una nueva contraseña
          </p>
        </div>
      </div>

      <div className={styles.panelFormulario}>
        <div className={styles.contenedorFormulario}>

          <h2 className={styles.tituloFormMobile}>Recuperar acceso</h2>

          {exito ? (
            <p className={styles.mensajeExito}>
              Contraseña actualizada correctamente. Te llevamos al login...
            </p>
          ) : (
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
                Nueva contraseña
                <input
                  type="password"
                  placeholder="••••••••"
                  className={styles.input}
                  {...register("password", {
                    required: "La nueva contraseña es obligatoria.",
                    minLength: { value: 4, message: "Debe tener al menos 4 caracteres." },
                  })}
                />
                {errors.password && (
                  <span className={styles.errorCampo}>{errors.password.message}</span>
                )}
              </label>

              <label className={styles.label}>
                Confirmar nueva contraseña
                <input
                  type="password"
                  placeholder="••••••••"
                  className={styles.input}
                  {...register("confirmarPassword", { required: "Confirmá tu nueva contraseña." })}
                />
                {errors.confirmarPassword && (
                  <span className={styles.errorCampo}>{errors.confirmarPassword.message}</span>
                )}
              </label>

              <button type="submit" className={styles.botonIngresar} disabled={enviando}>
                {enviando ? "Actualizando..." : "Actualizar contraseña"}
              </button>

              {errorRecuperar && (
                <p className={styles.error}>{errorRecuperar}</p>
              )}
            </form>
          )}

          <div className={styles.separador}></div>

          <p className={styles.textoRegistro}>
            ¿Recordaste tu contraseña?{" "}
            <Link to="/login" className={styles.linkRegistro}>
              Ingresá
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
}

export default Recuperar;