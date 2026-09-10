import { Link } from "react-router-dom";
import styles from "./TarjetaReceta.module.css";

function TarjetaReceta({ receta, nombrePaciente }) {
  const { medicamento, presentacion, cantidadComprimidos, estado, fechaSolicitud } = receta;

  const claseEstado =
    estado === "APROBADA"
      ? styles.aprobada
      : estado === "RECHAZADA"
      ? styles.rechazada
      : styles.pendiente;

  return (
    <article className={styles.tarjeta}>

      <div className={styles.encabezado}>
        <div>
          <h3 className={styles.medicamento}>
            {medicamento?.nombre}
          </h3>

          {nombrePaciente && (
            <p className={styles.paciente}>{nombrePaciente}</p>
          )}
        </div>

        <span className={`${styles.estado} ${claseEstado}`}>
          {estado}
        </span>
      </div>

      <div className={styles.informacion}>

        <div className={styles.dato}>
          <span className={styles.etiqueta}>Presentación</span>
          <span className={styles.valor}>{presentacion}</span>
        </div>

        <div className={styles.dato}>
          <span className={styles.etiqueta}>Comprimidos</span>
          <span className={styles.valor}>{cantidadComprimidos}</span>
        </div>

        <div className={styles.dato}>
          <span className={styles.etiqueta}>Emitida</span>
          <span className={styles.valor}>
            {new Date(fechaSolicitud).toLocaleDateString("es-AR")}
          </span>
        </div>

      </div>

      {estado === "APROBADA" && (
        <div className={styles.acciones}>
          <Link
            to={`/recetas/${receta.id}/renovar`}
            className={styles.botonRenovar}
          >
            Renovar
          </Link>
        </div>
      )}

    </article>
  );
}

export default TarjetaReceta;