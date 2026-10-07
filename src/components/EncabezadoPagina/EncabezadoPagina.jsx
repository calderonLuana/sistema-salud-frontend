import { useNavigate, Link } from "react-router-dom";
import styles from "./EncabezadoPagina.module.css";

function EncabezadoPagina({ titulo, mostrarLogo = false, mostrarIconoPerfil = true }) {
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

      {mostrarLogo ? (
        <div className={styles.logo}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
            <path d="M7 20h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M10 16v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="19" cy="16" r="4.2" fill="currentColor" stroke="#7c6fe0" strokeWidth="1" />
            <path d="M19 14v4M17 16h4" stroke="#7c6fe0" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span>LAV</span>
        </div>
      ) : (
        <h1 className={styles.titulo}>{titulo}</h1>
      )}

      {mostrarIconoPerfil && (
        <Link to="/perfil" className={styles.iconoPerfil} aria-label="Perfil">
          👤
        </Link>
      )}
    </header>
  );
}

export default EncabezadoPagina;