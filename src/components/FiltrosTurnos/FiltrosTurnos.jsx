import styles from "./FiltrosTurnos.module.css";

function FiltrosTurnos({ texto, onCambiarTexto, estado, onCambiarEstado }) {
  return (
    <div className={styles.contenedor}>
      <input
        type="text"
        className={styles.buscador}
        placeholder="Buscar turno por especialidad..."
        value={texto}
        onChange={(e) => onCambiarTexto(e.target.value)}
      />

      <select
        className={styles.selectEstado}
        value={estado}
        onChange={(e) => onCambiarEstado(e.target.value)}
      >
        <option value="TODOS">Todos los estados</option>
        <option value="RESERVADO">Reservado</option>
        <option value="CANCELADO">Cancelado</option>
      </select>
    </div>
  );
}

export default FiltrosTurnos;