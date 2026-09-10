import styles from "./FiltrosRecetas.module.css";

function FiltrosRecetas({ texto, onCambiarTexto, estado, onCambiarEstado }) {
  return (
    <div className={styles.contenedor}>
      <input
        type="text"
        className={styles.buscador}
        placeholder="Buscar receta por medicamento..."
        value={texto}
        onChange={(e) => onCambiarTexto(e.target.value)}
      />

      <select
        className={styles.selectEstado}
        value={estado}
        onChange={(e) => onCambiarEstado(e.target.value)}
      >
        <option value="TODOS">Todos los estados</option>
        <option value="PENDIENTE">Pendiente</option>
        <option value="APROBADA">Aprobada</option>
        <option value="RECHAZADA">Rechazada</option>
      </select>
    </div>
  );
}

export default FiltrosRecetas;