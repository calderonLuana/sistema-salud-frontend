import TarjetaTurno from "../TarjetaTurno/TarjetaTurno";
import styles from "./ListaTurnos.module.css";

function ListaTurnos({ titulo, turnos, onCancelar }) {
  return (
    <section className={styles.lista}>
      <h2 className={styles.titulo}>{titulo}</h2>

      {turnos.length === 0 ? (
        <p className={styles.vacio}>No hay turnos.</p>
      ) : (
        <div className={styles.grupo}>
          {turnos.map((turno) => (
            <TarjetaTurno
              key={turno.id}
              turno={turno}
              onCancelar={onCancelar}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ListaTurnos;