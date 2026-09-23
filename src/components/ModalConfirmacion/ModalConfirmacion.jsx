import { useEffect } from "react";
import styles from "./ModalConfirmacion.module.css";

function ModalConfirmacion({
  abierto,
  titulo,
  mensaje,
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
  onConfirmar,
  onCancelar,
}) {
  useEffect(() => {
    function manejarEscape(evento) {
      if (evento.key === "Escape") {
        onCancelar();
      }
    }

    if (abierto) {
      document.addEventListener("keydown", manejarEscape);
    }

    return () => document.removeEventListener("keydown", manejarEscape);
  }, [abierto, onCancelar]);

  if (!abierto) return null;

  return (
    <div className={styles.overlay} onClick={onCancelar}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        onClick={(evento) => evento.stopPropagation()}
      >
        <h3 className={styles.titulo}>{titulo}</h3>
        <p className={styles.mensaje}>{mensaje}</p>

        <div className={styles.acciones}>
          <button
            type="button"
            className={styles.botonCancelar}
            onClick={onCancelar}
          >
            {textoCancelar}
          </button>

          <button
            type="button"
            className={styles.botonConfirmar}
            onClick={onConfirmar}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalConfirmacion;