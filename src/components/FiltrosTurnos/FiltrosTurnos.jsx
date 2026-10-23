import { ETIQUETAS_ESTADO, nombreCompleto } from "../../utils/turnos";
import styles from "./FiltrosTurnos.module.css";

// "children" recibe el botón "Solicitar turno" para que quede en la misma fila.
function FiltrosTurnos({
  texto,
  onCambiarTexto,
  paciente,
  onCambiarPaciente,
  pacientes,
  usuarioId,
  estado,
  onCambiarEstado,
  children,
}) {
  return (
    <div className={styles.contenedor}>
      <input
        type="text"
        className={styles.buscador}
        placeholder="Buscar turno por especialidad..."
        aria-label="Buscar turno por especialidad"
        value={texto}
        onChange={(e) => onCambiarTexto(e.target.value)}
      />

      <label className={styles.campo}>
        <span className={styles.etiqueta}>Paciente</span>
        <select
          className={styles.select}
          value={paciente}
          onChange={(e) => onCambiarPaciente(e.target.value)}
        >
          <option value="TODOS">Todos</option>
          {pacientes.map((p) => (
            <option key={p.id} value={p.id}>
              {nombreCompleto(p)}
              {p.id === usuarioId ? " (yo)" : ""}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.campo}>
        <span className={styles.etiqueta}>Estado</span>
        <select
          className={styles.select}
          value={estado}
          onChange={(e) => onCambiarEstado(e.target.value)}
        >
          <option value="TODOS">Todos</option>
          <option value="RESERVADO">{ETIQUETAS_ESTADO.RESERVADO}</option>
          <option value="COMPLETADO">{ETIQUETAS_ESTADO.COMPLETADO}</option>
          <option value="CANCELADO">{ETIQUETAS_ESTADO.CANCELADO}</option>
          {/* FUNCIONALIDAD DE PRUEBA - NO APTA PARA PRODUCCIÓN (ver utils/turnos.js) */}
          <option value="NO_ASISTIO">{ETIQUETAS_ESTADO.NO_ASISTIO}</option>
        </select>
      </label>

      {children}
    </div>
  );
}

export default FiltrosTurnos;