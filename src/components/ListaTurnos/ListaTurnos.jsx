import TarjetaTurno from "../TarjetaTurno/TarjetaTurno";
import styles from "./ListaTurnos.module.css";

function IconoCalendario() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconoReloj() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// icono: "calendario" | "reloj"
// controles: elementos opcionales a la derecha del título (ej: filtro de período)
function ListaTurnos({
  titulo,
  icono,
  turnos,
  usuarioId,
  onCancelar,
  mensajeVacio,
  controles,
}) {
  return (
    <section className={styles.lista}>
      <div className={styles.encabezado}>
        <h2 className={styles.titulo}>
          <span className={styles.icono}>
            {icono === "reloj" ? <IconoReloj /> : <IconoCalendario />}
          </span>
          {titulo}
          <span className={styles.contador}>({turnos.length})</span>
        </h2>

        {controles}
      </div>

      {turnos.length === 0 ? (
        <p className={styles.vacio}>{mensajeVacio}</p>
      ) : (
        <div className={styles.grupo}>
          {turnos.map((turno) => (
            <TarjetaTurno
              key={turno.id}
              turno={turno}
              usuarioId={usuarioId}
              onCancelar={onCancelar}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ListaTurnos;