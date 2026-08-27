import { Link } from "react-router-dom";
import { formatearFecha } from "../../utils/formatearFecha";
import { formatearHora } from "../../utils/formatearHora";
import styles from "./TarjetaTurno.module.css";

function TarjetaTurno({ turno, onCancelar }) {
  const { Disponibilidad, estado } = turno;

  const {
    Profesional,
    fecha,
    hora,
    lugar,
  } = Disponibilidad;

  const {
    Especialidad,
    nombre,
    apellido,
  } = Profesional;

  return (
    <article className={styles.tarjeta}>

      <div className={styles.franjaFecha}>
        {formatearFecha(fecha)} • {formatearHora(hora)} hs
      </div>

      <div className={styles.cuerpo}>

        <div className={styles.encabezado}>
          <div className={styles.profesionalInfo}>
            <h3 className={styles.nombreProfesional}>
              Dr. {nombre} {apellido}
            </h3>

            <p className={styles.especialidad}>
              {Especialidad.nombre}
            </p>
          </div>

          <span
            className={`${styles.estado} ${
              estado === "RESERVADO"
                ? styles.reservado
                : styles.cancelado
            }`}
          >
            {estado}
          </span>
        </div>

        <div className={styles.dato}>
          <span className={styles.etiqueta}>
            Lugar
          </span>

          <span className={styles.valor}>
            {lugar}
          </span>
        </div>

        {estado === "RESERVADO" && (
          <div className={styles.acciones}>
            <Link
              to={`/turnos/${turno.id}/editar`}
              className={styles.botonEditar}
            >
              Editar turno
            </Link>

            <button
              type="button"
              className={styles.botonCancelar}
              onClick={() => onCancelar(turno.id)}
            >
              Cancelar turno
            </button>
          </div>
        )}

      </div>

    </article>
  );
}

export default TarjetaTurno;