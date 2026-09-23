import { Link } from "react-router-dom";
import styles from "./EncabezadoInicio.module.css";

function EncabezadoInicio({ onAbrirMenu }) {
  return (
    <header className={styles.header}>
      <button
        type="button"
        className={styles.botonMenu}
        onClick={onAbrirMenu}
        aria-label="Abrir menú"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

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

      <Link to="/perfil" className={styles.iconoPerfil} aria-label="Perfil">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
          <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </Link>
    </header>
  );
}

export default EncabezadoInicio;