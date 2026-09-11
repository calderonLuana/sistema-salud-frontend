import styles from "./PiePagina.module.css";

function PiePagina() {
  function volverArriba() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className={styles.piePagina}>
      <p className={styles.nombre}>Centro LAV</p>
      <p className={styles.dato}>Dirección</p>
      <p className={styles.dato}>Horario de atención</p>

      <button
        type="button"
        className={styles.botonVolverArriba}
        onClick={volverArriba}
      >
        ↑ Volver arriba
      </button>
    </footer>
  );
}

export default PiePagina;