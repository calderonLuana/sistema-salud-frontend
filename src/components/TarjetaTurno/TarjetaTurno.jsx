import { Link } from "react-router-dom";
import { formatearFecha } from "../../utils/formatearFecha";
import { formatearHora } from "../../utils/formatearHora";
import {
  ETIQUETAS_ESTADO,
  etiquetaVinculo,
  nombreCompleto,
} from "../../utils/turnos";
import styles from "./TarjetaTurno.module.css";

const CLASE_ESTADO = {
  COMPLETADO: styles.completado,
  CANCELADO: styles.cancelado,
  // FUNCIONALIDAD DE PRUEBA - NO APTA PARA PRODUCCIÓN (ver utils/turnos.js)
  NO_ASISTIO: styles.noAsistio,
};

function IconoPersona() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// El turno llega con "paciente" (datos del afiliado) y "estadoVisible"
// (RESERVADO en próximos; COMPLETADO, CANCELADO o NO_ASISTIO en anteriores).
// puedeCancelar y puedeEditar los calcula el backend (solo para próximos).
function TarjetaTurno({ turno, usuarioId, onCancelar }) {
  const { Disponibilidad, paciente, estadoVisible } = turno;

  const especialidad = Disponibilidad?.Profesional?.Especialidad?.nombre;
  const esProximo = estadoVisible === "RESERVADO";

  return (
    <article className={styles.tarjeta}>
      <div className={styles.franja}>
        {etiquetaVinculo(paciente, usuarioId)}
      </div>

      <div className={styles.cuerpo}>
        <div className={styles.avatar}>
          <IconoPersona />
        </div>

        <div className={styles.info}>
          <h3 className={styles.paciente}>{nombreCompleto(paciente)}</h3>
          <p className={styles.especialidad}>{especialidad}</p>
          <p className={styles.fechaHora}>
            {formatearFecha(Disponibilidad.fecha)} • {formatearHora(Disponibilidad.hora)}
          </p>
        </div>
      </div>

      <div className={styles.acciones}>
        {/* Se diseña más adelante: abrirá una ventana de solo lectura */}
        <button
          type="button"
          className={`${styles.boton} ${styles.botonDetalles}`}
          disabled
          title="Disponible próximamente"
        >
          Ver detalles
        </button>

        {esProximo ? (
          <>
            {turno.puedeEditar && (
              <Link
                to={`/turnos/${turno.id}/editar`}
                className={`${styles.boton} ${styles.botonEditar}`}
              >
                Editar turno
              </Link>
            )}

            {turno.puedeCancelar && (
              <button
                type="button"
                className={`${styles.boton} ${styles.botonCancelar}`}
                onClick={() => onCancelar(turno)}
              >
                Cancelar turno
              </button>
            )}
          </>
        ) : (
          <span className={`${styles.boton} ${styles.estado} ${CLASE_ESTADO[estadoVisible]}`}>
            {ETIQUETAS_ESTADO[estadoVisible]}
          </span>
        )}
      </div>
    </article>
  );
}

export default TarjetaTurno;