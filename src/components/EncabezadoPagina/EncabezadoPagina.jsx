import { useNavigate, Link } from "react-router-dom";
import styles from "./EncabezadoPagina.module.css";

function EncabezadoPagina({ titulo }) {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <button
        type="button"
        className={styles.botonVolver}
        onClick={() => navigate(-1)}
        aria-label="Volver"
      >
        ←
      </button>

      <h1 className={styles.titulo}>{titulo}</h1>

      <Link to="/perfil" className={styles.iconoPerfil} aria-label="Perfil">
        👤
      </Link>
    </header>
  );
}

export default EncabezadoPagina;